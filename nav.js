/*
  nav.js — v2
  -----------
  Shared navigation for works and sketches.

  Design principles (from UX research):
  - "Be creative with your art, conventional with your navigation" (gallery frame principle)
  - Nav is fixed top bar — where users expect it (Nielsen, Krug)
  - High-emphasis text at 87%+ opacity (Material Design dark theme)
  - Minimum 44x44px touch targets (WCAG 2.2, Apple HIG)
  - Glassmorphic backdrop for readability over any canvas
  - Hover feedback within 120ms (NN/g guidelines)
  - Related works as secondary bottom element
*/

(function () {

  // === CATALOGUE ===
  const works = [
    { id: 'w001', title: 'Entry Point', path: '/works/001-entry-point/', type: 'work' },
    { id: 'w002', title: 'Buff', path: '/works/002-buff/', type: 'work' },
    { id: 'w003', title: 'Closing Room', path: '/works/003-closing-room/', type: 'work' },
  ];

  const sketches = [
    { id: 's001', title: 'Beating', path: '/sketches/001-beating.html', type: 'sketch' },
    { id: 's002', title: 'Incommensurable Loops', path: '/sketches/002-incommensurable-loops.html', type: 'sketch' },
    { id: 's003', title: 'Drone', path: '/sketches/003-radigue-drone.html', type: 'sketch' },
  ];

  const all = [...works, ...sketches];

  // === RELATIONSHIPS ===
  const related = {
    'w001': [
      { id: 'w002', note: 'the erasure of these marks' },
      { id: 'w003', note: 'what remains after everything' },
    ],
    'w002': [
      { id: 'w001', note: 'the marks before the erasure' },
      { id: 'w003', note: 'memory as material' },
    ],
    'w003': [
      { id: 'w002', note: 'the cycle of making and unmaking' },
      { id: 's002', note: 'sound study — loops that never repeat' },
    ],
    's001': [
      { id: 's002', note: 'from two waves to seven' },
      { id: 's003', note: 'from beating to breathing' },
    ],
    's002': [
      { id: 's001', note: 'the simplest version of this idea' },
      { id: 'w003', note: 'visual counterpart — worlds that never repeat' },
    ],
    's003': [
      { id: 's001', note: 'where the listening started' },
      { id: 's002', note: 'structure instead of texture' },
    ],
  };

  // === INJECT STYLES ===
  const style = document.createElement('style');
  style.textContent = `
    /* ---- TOP NAV BAR ---- */
    .nav-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 24px;
      background: rgba(10, 10, 8, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      user-select: none;
    }

    .nav-bar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nav-bar-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Nav links — proper touch targets (44px+) */
    .nav-bar a {
      display: inline-flex;
      align-items: center;
      height: 44px;
      padding: 0 14px;
      border-radius: 6px;
      font-size: 13px;
      letter-spacing: 0.06em;
      text-decoration: none;
      cursor: pointer;
      transition: background-color 120ms ease-out, color 120ms ease-out;
    }

    .nav-bar a.nav-home {
      color: rgba(255, 255, 255, 0.9);
      font-size: 12px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
    .nav-bar a.nav-home:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .nav-bar .nav-title {
      color: rgba(255, 255, 255, 0.45);
      font-size: 12px;
      letter-spacing: 0.08em;
      padding: 0;
      pointer-events: none;
    }

    .nav-bar .nav-sep {
      color: rgba(255, 255, 255, 0.15);
      font-size: 11px;
      padding: 0;
      pointer-events: none;
    }

    .nav-bar a.nav-link {
      color: #8abfb8;
      font-size: 13px;
    }
    .nav-bar a.nav-link:hover {
      background: rgba(138, 191, 184, 0.1);
      color: #a8d4ce;
    }

    /* Hide the old inline .back link when nav-bar is present */
    body[data-nav-id] .back {
      display: none !important;
    }

    /* ---- RELATED WORKS (bottom) ---- */
    .nav-related {
      position: fixed;
      bottom: 0;
      right: 0;
      z-index: 500;
      font-family: 'Courier New', Courier, monospace;
      padding: 14px 20px;
      background: rgba(10, 10, 8, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      border-left: 1px solid rgba(255, 255, 255, 0.05);
      border-top-left-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      user-select: none;
      max-width: 380px;
    }

    .nav-related-label {
      color: #8abfb8;
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .nav-related a {
      display: block;
      padding: 6px 10px;
      border-radius: 4px;
      text-align: right;
      text-decoration: none;
      font-size: 12px;
      color: #d0cbc2;
      line-height: 1.5;
      cursor: pointer;
      transition: background-color 120ms ease-out, color 120ms ease-out;
    }
    .nav-related a:hover {
      background: rgba(138, 191, 184, 0.08);
      color: #8abfb8;
    }

    .nav-related .related-note {
      color: #6a655c;
      font-size: 11px;
    }

    /* Focus states */
    .nav-bar a:focus-visible,
    .nav-related a:focus-visible {
      outline: 2px solid #8abfb8;
      outline-offset: 2px;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .nav-bar { padding: 0 16px; height: 48px; }
      .nav-bar a { padding: 0 10px; font-size: 12px; }
      .nav-bar .nav-title { display: none; }
      .nav-bar .nav-sep { display: none; }
      .nav-related { max-width: 280px; }
    }
  `;
  document.head.appendChild(style);

  // === DETERMINE CURRENT PAGE ===
  const currentId = document.body.getAttribute('data-nav-id');
  if (!currentId) return;

  const currentItem = all.find(item => item.id === currentId);
  const currentType = currentItem?.type;

  // === BUILD NAV BAR ===
  const bar = document.createElement('nav');
  bar.className = 'nav-bar';
  bar.setAttribute('role', 'navigation');
  bar.setAttribute('aria-label', 'Site navigation');

  // Left side: Home + current title
  const left = document.createElement('div');
  left.className = 'nav-bar-left';

  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.className = 'nav-home';
  homeLink.textContent = '← Home';
  homeLink.setAttribute('aria-label', 'Return to home page');
  left.appendChild(homeLink);

  if (currentItem) {
    const sep = document.createElement('span');
    sep.className = 'nav-sep';
    sep.textContent = '/';
    left.appendChild(sep);

    const title = document.createElement('span');
    title.className = 'nav-title';
    title.textContent = currentItem.title;
    left.appendChild(title);
  }

  bar.appendChild(left);

  // Right side: Prev / Next
  const sameType = currentType === 'work' ? works : sketches;
  const typeIndex = sameType.findIndex(item => item.id === currentId);
  const prev = typeIndex > 0 ? sameType[typeIndex - 1] : null;
  const next = typeIndex < sameType.length - 1 ? sameType[typeIndex + 1] : null;

  const right = document.createElement('div');
  right.className = 'nav-bar-right';

  if (prev) {
    const a = document.createElement('a');
    a.href = prev.path;
    a.className = 'nav-link';
    a.textContent = `← ${prev.title}`;
    a.setAttribute('aria-label', `Previous: ${prev.title}`);
    right.appendChild(a);
  }

  if (next) {
    const a = document.createElement('a');
    a.href = next.path;
    a.className = 'nav-link';
    a.textContent = `${next.title} →`;
    a.setAttribute('aria-label', `Next: ${next.title}`);
    right.appendChild(a);
  }

  bar.appendChild(right);
  document.body.prepend(bar);

  // === RELATED WORKS (bottom-right) ===
  const relations = related[currentId];
  if (relations && relations.length > 0) {
    const container = document.createElement('div');
    container.className = 'nav-related';
    container.setAttribute('aria-label', 'Related works');

    const label = document.createElement('div');
    label.className = 'nav-related-label';
    label.textContent = 'Related';
    container.appendChild(label);

    relations.forEach(rel => {
      const item = all.find(i => i.id === rel.id);
      if (!item) return;

      const a = document.createElement('a');
      a.href = item.path;
      a.innerHTML = `${item.title} <span class="related-note">— ${rel.note}</span>`;
      a.setAttribute('aria-label', `Related: ${item.title} — ${rel.note}`);
      container.appendChild(a);
    });

    document.body.appendChild(container);
  }

})();
