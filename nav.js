/*
  nav.js — v3
  -----------
  Navigation as real UI, not text links.

  Pill buttons with backgrounds, proper sizing, always visible.
  Home is always present. Prev/Next are always present when applicable.
  Related works in a bottom panel.

  All buttons are 44px+ touch targets with visible backgrounds.
  No more guessing what's clickable.
*/

(function () {

  // === CATALOGUE ===
  const works = [
    { id: 'w001', title: 'Entry Point', path: '/works/001-entry-point/', type: 'work' },
    { id: 'w002', title: 'Buff', path: '/works/002-buff/', type: 'work' },
    { id: 'w003', title: 'Closing Room', path: '/works/003-closing-room/', type: 'work' },
    { id: 'w004', title: 'Incommensurable', path: '/works/004-incommensurable/', type: 'work' },
    { id: 'w005', title: 'Stigmergy', path: '/works/005-stigmergy/', type: 'work' },
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
      { id: 'w004', note: 'the sound of non-repeating systems' },
    ],
    'w004': [
      { id: 'w003', note: 'the visual counterpart — worlds that close' },
      { id: 'w005', note: 'from individual process to collective emergence' },
    ],
    'w005': [
      { id: 'w004', note: 'individual voices before the collective' },
      { id: 'w003', note: 'traces that persist after the agent is gone' },
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

  // === STYLES ===
  const style = document.createElement('style');
  style.textContent = `
    /* Restore cursor over all nav elements */
    .nav-pill, .nav-pill *, .nav-bar-v3, .nav-bar-v3 *,
    .nav-related-v3, .nav-related-v3 * {
      cursor: default !important;
    }
    .nav-pill, .nav-related-v3 a {
      cursor: pointer !important;
    }

    /* Hide old .back links */
    body[data-nav-id] .back {
      display: none !important;
    }

    /* === TOP BAR === */
    .nav-bar-v3 {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 9000;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      background: rgba(8, 12, 20, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .nav-bar-left, .nav-bar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-bar-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 16px;
      font-style: italic;
      color: rgba(232, 228, 220, 0.5);
      pointer-events: none;
      white-space: nowrap;
    }

    /* === PILL BUTTON === */
    .nav-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 44px;
      padding: 0 20px;
      border-radius: 22px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: rgba(232, 228, 220, 0.85);
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 13px;
      font-weight: 400;
      letter-spacing: 0.04em;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }

    .nav-pill:hover {
      background: rgba(212, 168, 85, 0.12);
      border-color: rgba(212, 168, 85, 0.25);
      color: #e8e4dc;
    }

    .nav-pill:active {
      background: rgba(212, 168, 85, 0.18);
      transform: scale(0.97);
    }

    .nav-pill:focus-visible {
      outline: 2px solid #d4a855;
      outline-offset: 2px;
    }

    .nav-pill.home {
      background: rgba(212, 168, 85, 0.08);
      border-color: rgba(212, 168, 85, 0.18);
      color: #d4a855;
    }

    .nav-pill.home:hover {
      background: rgba(212, 168, 85, 0.18);
      border-color: rgba(212, 168, 85, 0.35);
      color: #e0ba6a;
    }

    .nav-pill .arrow {
      font-size: 16px;
      line-height: 1;
    }

    /* Compact pills for prev/next on small screens */
    @media (max-width: 700px) {
      .nav-pill .pill-label { display: none; }
      .nav-pill { padding: 0 14px; min-width: 44px; justify-content: center; }
      .nav-bar-center { display: none; }
    }

    /* === RELATED PANEL (bottom) === */
    .nav-related-v3 {
      position: fixed;
      bottom: 0;
      right: 0;
      z-index: 9000;
      padding: 16px 20px;
      background: rgba(8, 12, 20, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      border-left: 1px solid rgba(255, 255, 255, 0.06);
      border-top-left-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      max-width: 380px;
    }

    .nav-related-v3 .related-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #d4a855;
      opacity: 0.7;
      margin-bottom: 4px;
    }

    .nav-related-v3 a {
      display: block;
      padding: 8px 14px;
      border-radius: 8px;
      text-align: right;
      text-decoration: none;
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 15px;
      color: #b8bcc8;
      line-height: 1.4;
      transition: background 0.12s ease, color 0.12s ease;
    }

    .nav-related-v3 a:hover {
      background: rgba(212, 168, 85, 0.08);
      color: #d4a855;
    }

    .nav-related-v3 a:focus-visible {
      outline: 2px solid #d4a855;
      outline-offset: 2px;
    }

    .nav-related-v3 .related-note {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #5d6272;
    }

    @media (max-width: 600px) {
      .nav-related-v3 { display: none; }
    }
  `;
  document.head.appendChild(style);

  // === DETERMINE CURRENT PAGE ===
  const currentId = document.body.getAttribute('data-nav-id');
  if (!currentId) return;

  const currentItem = all.find(item => item.id === currentId);
  const currentType = currentItem?.type;

  // === BUILD TOP BAR ===
  const bar = document.createElement('nav');
  bar.className = 'nav-bar-v3';
  bar.setAttribute('role', 'navigation');
  bar.setAttribute('aria-label', 'Site navigation');

  // Left: Home + Prev
  const left = document.createElement('div');
  left.className = 'nav-bar-left';

  const home = document.createElement('a');
  home.href = '/';
  home.className = 'nav-pill home';
  home.innerHTML = '<span class="arrow">←</span> <span class="pill-label">Home</span>';
  home.setAttribute('aria-label', 'Return to home');
  left.appendChild(home);

  // Prev
  const sameType = currentType === 'work' ? works : sketches;
  const typeIndex = sameType.findIndex(item => item.id === currentId);
  const prev = typeIndex > 0 ? sameType[typeIndex - 1] : null;

  if (prev) {
    const btn = document.createElement('a');
    btn.href = prev.path;
    btn.className = 'nav-pill';
    btn.innerHTML = `<span class="arrow">‹</span> <span class="pill-label">${prev.title}</span>`;
    btn.setAttribute('aria-label', `Previous: ${prev.title}`);
    left.appendChild(btn);
  }

  bar.appendChild(left);

  // Center: current title
  const center = document.createElement('div');
  center.className = 'nav-bar-center';
  center.textContent = currentItem ? currentItem.title : '';
  bar.appendChild(center);

  // Right: Next
  const right = document.createElement('div');
  right.className = 'nav-bar-right';
  const next = typeIndex < sameType.length - 1 ? sameType[typeIndex + 1] : null;

  if (next) {
    const btn = document.createElement('a');
    btn.href = next.path;
    btn.className = 'nav-pill';
    btn.innerHTML = `<span class="pill-label">${next.title}</span> <span class="arrow">›</span>`;
    btn.setAttribute('aria-label', `Next: ${next.title}`);
    right.appendChild(btn);
  }

  bar.appendChild(right);
  document.body.prepend(bar);

  // === RELATED WORKS ===
  const relations = related[currentId];
  if (relations && relations.length > 0) {
    const container = document.createElement('div');
    container.className = 'nav-related-v3';
    container.setAttribute('aria-label', 'Related works');

    const label = document.createElement('div');
    label.className = 'related-label';
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
