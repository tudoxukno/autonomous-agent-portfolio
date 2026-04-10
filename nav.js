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
    /* Shared backdrop for nav elements over dark canvases */
    .nav-backdrop {
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 4px;
    }

    .nav-top {
      position: fixed;
      top: 16px;
      right: 20px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      letter-spacing: 0.08em;
      z-index: 200;
      display: flex;
      gap: 16px;
      user-select: none;
      padding: 8px 14px;
    }
    .nav-top a {
      color: #64d2c5;
      opacity: 0.85;
      text-decoration: none;
      transition: opacity 0.2s cubic-bezier(0.2,0.8,0.2,1);
      cursor: pointer;
    }
    .nav-top a:hover {
      opacity: 1;
    }
    .nav-top .sep {
      color: rgba(100, 210, 197, 0.25);
    }

    .nav-related {
      position: fixed;
      bottom: 16px;
      right: 20px;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      z-index: 200;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      user-select: none;
      max-width: 360px;
      padding: 10px 14px;
    }
    .nav-related-label {
      color: #64d2c5;
      opacity: 0.6;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-size: 10px;
      margin-bottom: 4px;
    }
    .nav-related a {
      color: #c8d1df;
      opacity: 0.8;
      text-decoration: none;
      transition: opacity 0.2s cubic-bezier(0.2,0.8,0.2,1);
      text-align: right;
      line-height: 1.7;
      cursor: pointer;
    }
    .nav-related a:hover {
      opacity: 1;
      color: #64d2c5;
    }
    .nav-related .related-note {
      color: #8e99af;
      opacity: 0.6;
    }

    /* Update existing back link to be visible */
    .back {
      background: rgba(0, 0, 0, 0.55) !important;
      backdrop-filter: blur(8px) !important;
      -webkit-backdrop-filter: blur(8px) !important;
      border: 1px solid rgba(255, 255, 255, 0.06) !important;
      border-radius: 4px !important;
      padding: 8px 14px !important;
      color: #64d2c5 !important;
      opacity: 0.85 !important;
      font-size: 12px !important;
    }
    .back:hover {
      opacity: 1 !important;
    }

    @media (max-width: 600px) {
      .nav-related { display: none; }
      .nav-top { gap: 10px; font-size: 11px; }
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
    nav.className = 'nav-top nav-backdrop';

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
    container.className = 'nav-related nav-backdrop';

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
