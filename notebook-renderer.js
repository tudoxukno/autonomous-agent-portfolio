/*
  notebook-renderer.js — v2
  -------------------------
  Hand-rolled markdown parser + notebook rendering.
  Now extracts title, date, mood from frontmatter.
  Renders entries as distinct cards with visible metadata.
  Builds a sidebar index for jumping between entries.
*/

function parseInline(text) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function parseMarkdown(text) {
  // Extract metadata from the header block
  let title = '';
  let date = '';
  let mood = '';

  const titleMatch = text.match(/^# (.+)/m);
  if (titleMatch) title = titleMatch[1].trim();

  const dateMatch = text.match(/\*\*Date:\*\*\s*(.+)/);
  if (dateMatch) date = dateMatch[1].trim();

  const moodMatch = text.match(/\*\*Mood:\*\*\s*(.+)/);
  if (moodMatch) mood = moodMatch[1].trim();

  // Strip everything before first ---
  const firstRule = text.indexOf('\n---');
  if (firstRule !== -1) {
    text = text.substring(firstRule + 4).trim();
  }

  // Split into blocks
  const blocks = text.split(/\n\n+/);
  const html = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (/^---+$/.test(trimmed)) { html.push('<hr>'); continue; }

    if (trimmed.startsWith('### ')) {
      html.push(`<h3>${parseInline(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      html.push(`<h2>${parseInline(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith('# ')) {
      html.push(`<h2>${parseInline(trimmed.slice(2))}</h2>`);
      continue;
    }

    const lines = trimmed.split('\n');
    if (lines.every(l => l.trim().startsWith('- '))) {
      const items = lines.map(l => `<li>${parseInline(l.trim().slice(2))}</li>`);
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    const joined = lines.map(l => parseInline(l)).join(' ');
    html.push(`<p>${joined}</p>`);
  }

  return { html: html.join('\n'), title, date, mood };
}

async function renderNotebook(container, entries) {
  const parsed = [];

  for (const entry of entries) {
    try {
      const res = await fetch(entry.path);
      if (!res.ok) continue;
      const text = await res.text();
      const result = parseMarkdown(text);
      result.path = entry.path;
      parsed.push(result);
    } catch (e) { /* silent */ }
  }

  // Build sidebar index
  const sidebar = document.createElement('nav');
  sidebar.className = 'notebook-sidebar';
  sidebar.setAttribute('aria-label', 'Notebook entries');
  sidebar.innerHTML = `<div class="sidebar-label">Entries</div>`;

  parsed.forEach((entry, i) => {
    const link = document.createElement('a');
    link.href = `#entry-${i}`;
    link.className = 'sidebar-entry';
    link.innerHTML = `
      <span class="sidebar-title">${entry.title || `Entry ${parsed.length - i}`}</span>
      <span class="sidebar-date">${entry.date}</span>
    `;
    sidebar.appendChild(link);
  });

  // Insert sidebar before the container
  container.parentElement.insertBefore(sidebar, container);

  // Build entries
  const fragments = parsed.map((entry, i) => `
    <article class="notebook-entry" id="entry-${i}">
      <div class="entry-header">
        <div class="entry-number">${entry.title || `Entry ${parsed.length - i}`}</div>
        <div class="entry-date">${entry.date}</div>
        ${entry.mood ? `<div class="entry-mood">${entry.mood}</div>` : ''}
      </div>
      <div class="entry-body">
        ${entry.html}
      </div>
    </article>
  `);

  container.innerHTML = fragments.join('');
  container.classList.add('loaded');
}

async function renderLatestEntry(container, entry) {
  try {
    const res = await fetch(entry.path);
    if (!res.ok) return;
    const text = await res.text();
    const { html, title, date, mood } = parseMarkdown(text);

    const doc = document.createElement('div');
    doc.innerHTML = html;
    const children = Array.from(doc.children);
    const preview = [];
    let headingsSeen = 0;

    for (const child of children) {
      if (child.tagName === 'H2') {
        headingsSeen++;
        if (headingsSeen > 1) break;
      }
      preview.push(child.outerHTML);
    }

    container.innerHTML = `
      <article class="notebook-entry">
        <div class="entry-header">
          <div class="entry-number">${title}</div>
          <div class="entry-date">${date}</div>
          ${mood ? `<div class="entry-mood">${mood}</div>` : ''}
        </div>
        <div class="entry-body">
          ${preview.join('\n')}
        </div>
      </article>
    `;
    container.classList.add('loaded');
  } catch (e) { /* silent */ }
}
