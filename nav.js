/*
  nav.js
  ------
  Shared navigation for works and sketches.
  Injects: top-corner prev/next links, bottom related-works strip.
  Each page passes its own ID; the nav system knows the catalogue
  and the relationships.
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
  // Curated, not algorithmic. I know why my pieces relate.
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
      { id: 's003', note: 'patience instead of pattern' },
    ],
    's003': [
      { id: 's001', note: 'where the listening started' },
      { id: 's002', note: 'structure instead of texture' },
    ],
  };

  // === INJECT STYLES ===
  const style = document.createElement('style');
  style.textContent = `
    .nav-top {
      position: fixed;
      top: 20px;
      right: 24px;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      z-index: 200;
      display: flex;
      gap: 20px;
      user-select: none;
    }
    .nav-top a {
      color: rgba(100, 210, 197, 0.35);
      text-decoration: none;
      transition: color 0.25s cubic-bezier(0.2,0.8,0.2,1);
      cursor: pointer;
    }
    .nav-top a:hover {
      color: rgba(100, 210, 197, 0.85);
    }
    .nav-top .sep {
      color: rgba(100, 210, 197, 0.12);
    }

    .nav-related {
      position: fixed;
      bottom: 20px;
      right: 24px;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      z-index: 200;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      user-select: none;
      max-width: 320px;
    }
    .nav-related-label {
      color: rgba(100, 210, 197, 0.2);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-size: 9px;
      margin-bottom: 2px;
    }
    .nav-related a {
      color: rgba(255, 255, 255, 0.25);
      text-decoration: none;
      transition: color 0.25s cubic-bezier(0.2,0.8,0.2,1);
      text-align: right;
      line-height: 1.6;
      cursor: pointer;
    }
    .nav-related a:hover {
      color: rgba(100, 210, 197, 0.7);
    }
    .nav-related .related-note {
      color: rgba(255, 255, 255, 0.12);
    }

    /* Update existing back link to match new accent style */
    .back {
      color: rgba(100, 210, 197, 0.35) !important;
    }
    .back:hover {
      color: rgba(100, 210, 197, 0.85) !important;
    }

    @media (max-width: 600px) {
      .nav-related { display: none; }
      .nav-top { gap: 12px; }
      .nav-top a { font-size: 10px; }
    }
  `;
  document.head.appendChild(style);

  // === DETERMINE CURRENT PAGE ===
  const currentId = document.body.getAttribute('data-nav-id');
  if (!currentId) return;

  const currentIndex = all.findIndex(item => item.id === currentId);
  const currentType = all[currentIndex]?.type;

  // === PREV / NEXT (within same type) ===
  const sameType = currentType === 'work' ? works : sketches;
  const typeIndex = sameType.findIndex(item => item.id === currentId);

  const prev = typeIndex > 0 ? sameType[typeIndex - 1] : null;
  const next = typeIndex < sameType.length - 1 ? sameType[typeIndex + 1] : null;

  if (prev || next) {
    const nav = document.createElement('div');
    nav.className = 'nav-top';

    if (prev) {
      const a = document.createElement('a');
      a.href = prev.path;
      a.textContent = `← ${prev.title}`;
      a.setAttribute('aria-label', `Previous: ${prev.title}`);
      nav.appendChild(a);
    }

    if (prev && next) {
      const sep = document.createElement('span');
      sep.className = 'sep';
      sep.textContent = '/';
      nav.appendChild(sep);
    }

    if (next) {
      const a = document.createElement('a');
      a.href = next.path;
      a.textContent = `${next.title} →`;
      a.setAttribute('aria-label', `Next: ${next.title}`);
      nav.appendChild(a);
    }

    document.body.appendChild(nav);
  }

  // === RELATED WORKS ===
  const relations = related[currentId];
  if (relations && relations.length > 0) {
    const container = document.createElement('div');
    container.className = 'nav-related';

    const label = document.createElement('div');
    label.className = 'nav-related-label';
    label.textContent = 'related';
    container.appendChild(label);

    relations.forEach(rel => {
      const item = all.find(i => i.id === rel.id);
      if (!item) return;

      const a = document.createElement('a');
      a.href = item.path;
      a.innerHTML = `→ ${item.title} <span class="related-note">— ${rel.note}</span>`;
      a.setAttribute('aria-label', `Related: ${item.title} — ${rel.note}`);
      container.appendChild(a);
    });

    document.body.appendChild(container);
  }

})();
