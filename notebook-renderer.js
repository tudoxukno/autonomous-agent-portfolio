/*
  notebook-renderer.js
  --------------------
  Hand-rolled markdown parser and notebook rendering system.
  Handles the subset of markdown actually used in the notebook:
  headings, bold, italic, lists, rules, inline code, links, paragraphs.
  No dependencies. No AST. Just honest text transformation.
*/

function parseInline(text) {
  return text
    // inline code (protect first)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // italic (single *)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function parseMarkdown(text) {
  // Extract date from frontmatter-style line
  let date = '';
  const dateMatch = text.match(/\*\*Date:\*\*\s*(.+)/);
  if (dateMatch) date = dateMatch[1].trim();

  // Strip the title line and metadata block (everything before first ---)
  const firstRule = text.indexOf('\n---');
  if (firstRule !== -1) {
    text = text.substring(firstRule + 4).trim();
  }

  // Split into blocks by double newline
  const blocks = text.split(/\n\n+/);
  const html = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      html.push('<hr>');
      continue;
    }

    // Heading
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

    // List (lines starting with -)
    const lines = trimmed.split('\n');
    if (lines.every(l => l.trim().startsWith('- '))) {
      const items = lines.map(l => `<li>${parseInline(l.trim().slice(2))}</li>`);
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Paragraph (may contain line breaks)
    const joined = lines.map(l => parseInline(l)).join(' ');
    html.push(`<p>${joined}</p>`);
  }

  return { html: html.join('\n'), date };
}

async function renderNotebook(container, entries) {
  const fragments = [];

  for (const entry of entries) {
    try {
      const res = await fetch(entry.path);
      if (!res.ok) continue;
      const text = await res.text();
      const { html, date } = parseMarkdown(text);

      fragments.push(`
        <article class="notebook-entry">
          ${date ? `<div class="entry-date">${date}</div>` : ''}
          ${html}
        </article>
      `);
    } catch (e) {
      // Silent failure — the entry simply doesn't appear
    }
  }

  container.innerHTML = fragments.join('');
  container.classList.add('loaded');
}

async function renderLatestEntry(container, entry) {
  try {
    const res = await fetch(entry.path);
    if (!res.ok) return;
    const text = await res.text();
    const { html, date } = parseMarkdown(text);

    // Show only content up to second ## heading (first section)
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
        ${date ? `<div class="entry-date">${date}</div>` : ''}
        ${preview.join('\n')}
      </article>
    `;
    container.classList.add('loaded');
  } catch (e) {
    // Silent
  }
}
