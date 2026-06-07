/* ═══════════════════════════════════════════════════
   INFINITY PLAYGROUND — script.js
   10 Interactive Experiments + Achievements + Easter Eggs
═══════════════════════════════════════════════════ */

'use strict';

// ────────────────────────────────────────────────
// 0. STATE
// ────────────────────────────────────────────────
const state = {
  currentExp: null,
  theme: 'dark',
  achievements: {},
  visitedExps: new Set(),
  easterEggsFound: 0,
  konamiStep: 0,
  clicks: 0,
};

// ────────────────────────────────────────────────
// 1. EXPERIMENTS META
// ────────────────────────────────────────────────
const experiments = [
  { id:'universe',    title:'Universe Size Explorer',       icon:'🌌', color:'#7c6aff', tag:'Science',     desc:'Journey from a human cell to the observable universe — and feel truly tiny.' },
  { id:'lifespan',    title:'Human Lifespan Calculator',    icon:'⏳', color:'#ff6ab0', tag:'Life',        desc:'Visualize your life in weeks, hours, and heartbeats.' },
  { id:'aitimeline',  title:'AI Future Timeline',           icon:'🤖', color:'#6affe8', tag:'Future',      desc:'Explore key milestones in the past and predicted future of Artificial Intelligence.' },
  { id:'money',       title:'Money Growth Simulator',       icon:'💰', color:'#ffd166', tag:'Finance',     desc:'See how compound interest transforms small savings into extraordinary wealth.' },
  { id:'timetravel',  title:'Time Travel Visualization',    icon:'🕰️',  color:'#ff9966', tag:'History',     desc:'Step into any year in history and discover what was happening on Earth.' },
  { id:'internet',    title:'Internet Data Flow',           icon:'🌐', color:'#06d6a0', tag:'Tech',        desc:'Every second, the internet moves mountains of data — visualize the flood.' },
  { id:'space',       title:'Space Distance Explorer',      icon:'🚀', color:'#a78bfa', tag:'Astronomy',   desc:'How long would it take to drive to other planets? Find out.' },
  { id:'game',        title:'Productivity Challenge',       icon:'🎯', color:'#f87171', tag:'Game',        desc:'Click the right targets as fast as you can — beat your own high score.' },
  { id:'population',  title:'World Population Visualizer',  icon:'👥', color:'#34d399', tag:'Society',     desc:'Every dot is a thousand people. Watch humanity grow in real time.' },
  { id:'career',      title:'Dream Career Roadmap',         icon:'🧭', color:'#60a5fa', tag:'Career',      desc:'Pick your dream career and get a personalised roadmap to get there.' },
];

// ────────────────────────────────────────────────
// 2. ACHIEVEMENTS
// ────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id:'first_exp',    icon:'🎉', name:'First Step',          desc:'Opened your first experiment' },
  { id:'explorer5',   icon:'🗺️',  name:'Explorer',            desc:'Visited 5 experiments' },
  { id:'explorer_all',icon:'🌍', name:'World Explorer',       desc:'Visited all 10 experiments' },
  { id:'konami',      icon:'🕹️',  name:'Konami Master',        desc:'Entered the Konami code' },
  { id:'star_finder', icon:'⭐', name:'Star Finder',          desc:'Discovered the hidden star' },
  { id:'clicker100',  icon:'🖱️',  name:'Click Machine',        desc:'Clicked 100 times total' },
  { id:'game_score',  icon:'🏅', name:'Sharp Shooter',        desc:'Scored 15+ in Productivity Game' },
  { id:'money_millionaire', icon:'💎', name:'Paper Millionaire', desc:'Simulated $1M in compound interest' },
  { id:'triple_egg',  icon:'🥚', name:'Easter Egg Hunter',    desc:'Found 3 easter eggs' },
  { id:'night_owl',   icon:'🦉', name:'Night Owl',            desc:'Explored after midnight' },
];

function unlockAchievement(id) {
  if (state.achievements[id]) return;
  state.achievements[id] = Date.now();
  const a = ACHIEVEMENTS.find(x => x.id === id);
  if (!a) return;
  document.getElementById('ach-icon').textContent = a.icon;
  document.getElementById('ach-title').textContent = 'Achievement Unlocked!';
  document.getElementById('ach-desc').textContent = a.name + ' — ' + a.desc;
  const toast = document.getElementById('achievement-toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
  document.getElementById('ach-count').textContent = Object.keys(state.achievements).length;
  renderAchPanel();
  // Night owl
  if (new Date().getHours() >= 0 && new Date().getHours() < 5) unlockAchievement('night_owl');
}

function renderAchPanel() {
  const list = document.getElementById('ach-list');
  list.innerHTML = ACHIEVEMENTS.map(a => `
    <div class="ach-row ${state.achievements[a.id] ? 'earned' : ''}">
      <div class="a-icon">${a.icon}</div>
      <div><div class="a-name">${a.name}</div><div class="a-desc">${a.desc}</div></div>
    </div>
  `).join('');
}

document.getElementById('achievement-btn').addEventListener('click', () => {
  document.getElementById('ach-panel').style.display = 'grid';
  renderAchPanel();
});
function closeAchPanel() { document.getElementById('ach-panel').style.display = 'none'; }
document.getElementById('ach-panel').addEventListener('click', e => {
  if (e.target === document.getElementById('ach-panel')) closeAchPanel();
});

// ────────────────────────────────────────────────
// 3. CURSOR
// ────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  state.clicks++;
  if (state.clicks >= 100) unlockAchievement('clicker100');
});

(function animTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.left = tx + 'px';
  trail.style.top  = ty + 'px';
  requestAnimationFrame(animTrail);
})();

// card hover glow
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.exp-card').forEach(card => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// ────────────────────────────────────────────────
// 4. HERO CANVAS — PARTICLE FIELD
// ────────────────────────────────────────────────
(function heroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const COLORS = ['#7c6aff','#ff6ab0','#6affe8','#ffd166'];
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * 2000 - 500,
      y: Math.random() * 2000 - 400,
      r: Math.random() * 2 + .5,
      vx: (Math.random() - .5) * .3,
      vy: (Math.random() - .5) * .3,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * .8 + .2,
    });
  }

  let mxH = W/2, myH = H/2;
  document.addEventListener('mousemove', e => { mxH = e.clientX; myH = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx + (mxH - W/2) * 0.00008;
      p.y += p.vy + (myH - H/2) * 0.00008;
      if (p.x < -20) p.x = W + 20;
      if (p.x > W+20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H+20) p.y = -20;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.a * 0.6;
      ctx.fill();
    });
    // connections
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#7c6aff';
          ctx.globalAlpha = (1 - d/100) * 0.12;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ────────────────────────────────────────────────
// 5. BUILD CARDS
// ────────────────────────────────────────────────
function buildCards() {
  const wrap = document.getElementById('cards-container');
  wrap.innerHTML = experiments.map((e,i) => `
    <div class="exp-card" data-id="${e.id}" data-delay="${i*60}" onclick="openExperiment('${e.id}')">
      <div class="card-icon" style="background:${e.color}22">${e.icon}</div>
      <div class="card-tag">${e.tag}</div>
      <div class="card-title">${e.title}</div>
      <div class="card-desc">${e.desc}</div>
      <div class="card-arrow">Explore <span>→</span></div>
    </div>
  `).join('');

  // Intersection observer for card reveals
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const delay = parseInt(en.target.dataset.delay || 0);
        setTimeout(() => en.target.classList.add('visible'), delay);
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.exp-card').forEach(c => obs.observe(c));
}
buildCards();

// ────────────────────────────────────────────────
// 6. NAVIGATION
// ────────────────────────────────────────────────
function showHome() {
  document.getElementById('home-screen').style.display = 'block';
  document.getElementById('experiment-screen').style.display = 'none';
  state.currentExp = null;
}

function openExperiment(id) {
  const exp = experiments.find(e => e.id === id);
  if (!exp) return;
  state.currentExp = id;
  state.visitedExps.add(id);
  document.getElementById('home-screen').style.display = 'none';
  const screen = document.getElementById('experiment-screen');
  screen.style.display = 'block';
  document.getElementById('exp-header-title').textContent = exp.icon + ' ' + exp.title;
  const content = document.getElementById('experiment-content');
  content.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'exp-content-inner page-enter';
  content.appendChild(wrap);
  EXPERIMENTS[id](wrap);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // achievements
  unlockAchievement('first_exp');
  if (state.visitedExps.size >= 5)  unlockAchievement('explorer5');
  if (state.visitedExps.size >= 10) unlockAchievement('explorer_all');
}

function shareExperiment() {
  const text = state.currentExp
    ? `Check out "${experiments.find(e=>e.id===state.currentExp)?.title}" on Infinity Playground!`
    : 'Check out Infinity Playground!';
  if (navigator.share) {
    navigator.share({ title: 'Infinity Playground', text, url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      document.querySelector('.share-btn').textContent = '✓ Copied!';
      setTimeout(() => document.querySelector('.share-btn').textContent = 'Share ↗', 2000);
    });
  }
}

// ────────────────────────────────────────────────
// 7. SEARCH
// ────────────────────────────────────────────────
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchResults.classList.remove('open'); return; }
  const hits = experiments.filter(e =>
    e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q) || e.tag.toLowerCase().includes(q)
  );
  if (hits.length === 0) { searchResults.classList.remove('open'); return; }
  searchResults.innerHTML = hits.map(e => `
    <div class="search-item" onclick="searchOpen('${e.id}')">
      <span class="s-icon">${e.icon}</span>
      <span class="s-name">${e.title}</span>
    </div>
  `).join('');
  searchResults.classList.add('open');
});

function searchOpen(id) {
  searchInput.value = '';
  searchResults.classList.remove('open');
  openExperiment(id);
}
document.addEventListener('click', e => {
  if (!e.target.closest('.nav-search')) searchResults.classList.remove('open');
});

// ────────────────────────────────────────────────
// 8. THEME TOGGLE
// ────────────────────────────────────────────────
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.body.className = state.theme;
}

// ────────────────────────────────────────────────
// 9. EASTER EGGS
// ────────────────────────────────────────────────
// Hidden star
document.getElementById('hidden-star').addEventListener('click', () => {
  state.easterEggsFound++;
  unlockAchievement('star_finder');
  if (state.easterEggsFound >= 3) unlockAchievement('triple_egg');
  const star = document.getElementById('hidden-star');
  star.style.fontSize = '3rem';
  star.style.color = '#ffd166';
  setTimeout(() => { star.style.fontSize = '.5rem'; star.style.color = 'transparent'; }, 1200);
});

// Konami code
const KONAMI = [38,38,40,40,37,39,37,39,66,65];
document.addEventListener('keydown', e => {
  if (e.keyCode === KONAMI[state.konamiStep]) {
    state.konamiStep++;
    if (state.konamiStep === KONAMI.length) {
      state.konamiStep = 0;
      state.easterEggsFound++;
      unlockAchievement('konami');
      if (state.easterEggsFound >= 3) unlockAchievement('triple_egg');
      // Rainbow flash
      document.body.style.transition = 'filter .2s';
      let hue = 0;
      const iv = setInterval(() => {
        document.body.style.filter = `hue-rotate(${hue}deg)`;
        hue += 30;
        if (hue > 360) { clearInterval(iv); document.body.style.filter = ''; }
      }, 60);
    }
  } else {
    state.konamiStep = 0;
  }
  // Secret: type "infinity"
  if (!state._typeBuf) state._typeBuf = '';
  state._typeBuf += String.fromCharCode(e.keyCode).toLowerCase();
  if (state._typeBuf.endsWith('infinity')) {
    state._typeBuf = '';
    state.easterEggsFound++;
    if (state.easterEggsFound >= 3) unlockAchievement('triple_egg');
    document.title = '∞ You found me! ∞';
    setTimeout(() => document.title = 'Infinity Playground — Explore Everything', 3000);
  }
  if (state._typeBuf.length > 20) state._typeBuf = state._typeBuf.slice(-20);
});

// ────────────────────────────────────────────────
// 10. HELPERS
// ────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1e12) return (n/1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return (n/1e9).toFixed(2) + 'B';
  if (n >= 1e6)  return (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3)  return (n/1e3).toFixed(1) + 'K';
  return n.toFixed(0);
}
function clamp(v,mn,mx) { return Math.min(mx, Math.max(mn, v)); }
function lerp(a,b,t)    { return a + (b-a)*t; }
function rand(mn,mx)    { return Math.random()*(mx-mn)+mn; }

// ════════════════════════════════════════════════════════
// ██  EXPERIMENTS  ██
// ════════════════════════════════════════════════════════
const EXPERIMENTS = {};

/* ─────────────────────────────────────────────────
   EXP 1: UNIVERSE SIZE EXPLORER
───────────────────────────────────────────────── */
EXPERIMENTS.universe = function(el) {
  const objects = [
    { name:'Proton',           size: 1e-15, color:'#ffd166', emoji:'⚛️',  fact:'A proton is 1 femtometre across — smaller than anything you can truly imagine.' },
    { name:'DNA Strand',       size: 2e-9,  color:'#ff6ab0', emoji:'🧬', fact:'DNA is only 2 nanometres wide, yet packs 3 billion base pairs per cell.' },
    { name:'Red Blood Cell',   size: 8e-6,  color:'#f87171', emoji:'🩸', fact:'8 micrometres wide — 1,000 cells could line up across a pin head.' },
    { name:'Human Hair',       size: 7e-5,  color:'#ffd166', emoji:'💈', fact:'About 70 micrometres wide — visible to the naked eye at its thickest.' },
    { name:'Human',            size: 1.7,   color:'#6affe8', emoji:'🧍', fact:'Average human height: 1.7 m. The benchmark for all our comparisons.' },
    { name:'Mount Everest',    size: 8848,  color:'#34d399', emoji:'⛰️',  fact:'8,848 m — the highest point on Earth above sea level.' },
    { name:'Earth',            size: 1.27e7,color:'#60a5fa', emoji:'🌍', fact:'12,742 km in diameter — our entire home, a pale blue dot.' },
    { name:'Jupiter',          size: 1.4e8, color:'#f59e0b', emoji:'🪐', fact:'1,300 Earths could fit inside Jupiter, the solar system\'s giant.' },
    { name:'The Sun',          size: 1.4e9, color:'#ffd166', emoji:'☀️',  fact:'The Sun contains 99.86% of all mass in the solar system.' },
    { name:'Solar System',     size: 6e12,  color:'#a78bfa', emoji:'🌌', fact:'The heliopause — edge of the solar wind — extends ~120 AU from the Sun.' },
    { name:'Milky Way',        size: 9.46e20,color:'#7c6aff',emoji:'🌠',fact:'100,000 light-years across, home to 200–400 billion stars.' },
    { name:'Observable Universe',size:8.8e26,color:'#ff6ab0',emoji:'🔭',fact:'93 billion light-years in diameter. The largest thing we can ever observe.' },
  ];

  let current = 4; // default: Human

  el.innerHTML = `
    <h2>Universe Size Explorer</h2>
    <p class="exp-intro">From the tiniest subatomic particle to the edge of everything we can see — explore the mind-bending scale of our universe.</p>
    <div class="obj-selector" id="obj-sel"></div>
    <div class="canvas-wrap"><canvas id="universe-canvas" height="300"></canvas></div>
    <div class="stat-grid">
      <div class="stat-box"><div class="s-val" id="u-size">—</div><div class="s-key">Size (metres)</div></div>
      <div class="stat-box"><div class="s-val" id="u-ratio">—</div><div class="s-key">× larger than proton</div></div>
      <div class="stat-box"><div class="s-val" id="u-lightyears">—</div><div class="s-key">Light-years</div></div>
    </div>
    <div class="fact-box" id="u-fact"></div>
  `;

  // Buttons
  const sel = document.getElementById('obj-sel');
  objects.forEach((o,i) => {
    const b = document.createElement('button');
    b.className = 'obj-btn' + (i===current?' active':'');
    b.textContent = o.emoji + ' ' + o.name;
    b.onclick = () => {
      current = i;
      document.querySelectorAll('.obj-btn').forEach((x,xi) => x.classList.toggle('active', xi===i));
      updateUniverse();
    };
    sel.appendChild(b);
  });

  // Canvas
  const canvas = document.getElementById('universe-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 800;
  canvas.height = 300;

  function updateUniverse() {
    const o = objects[current];
    // Stats
    const s = o.size;
    document.getElementById('u-size').textContent = s < 1 ? s.toExponential(2) : fmt(s);
    document.getElementById('u-ratio').textContent = (s / 1e-15).toExponential(2);
    const ly = s / 9.461e15;
    document.getElementById('u-lightyears').textContent = ly < 0.001 ? '<0.001' : ly.toExponential(2);
    document.getElementById('u-fact').innerHTML = `<strong>${o.emoji} ${o.name}</strong> — ${o.fact}`;
    drawUniverse();
  }

  function drawUniverse() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    // starfield bg
    ctx.fillStyle = '#0a0a18';
    ctx.fillRect(0,0,W,H);
    for (let i=0;i<80;i++) {
      ctx.beginPath();
      ctx.arc(rand(0,W), rand(0,H), rand(.3,1.5), 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${rand(.1,.6)})`;
      ctx.fill();
    }

    // Scale bar — all objects displayed as relative circles
    const maxR = H * 0.38;
    const minR = 4;
    const logMin = Math.log10(objects[0].size);
    const logMax = Math.log10(objects[objects.length-1].size);

    objects.forEach((o,i) => {
      const logS = Math.log10(o.size);
      const t = (logS - logMin) / (logMax - logMin);
      const r = lerp(minR, maxR, t);
      const x = (i+1) * (W / (objects.length+1));
      const y = H / 2;
      const alpha = i === current ? 1 : 0.3;

      // Glow
      if (i === current) {
        const grad = ctx.createRadialGradient(x,y,0,x,y,r*2);
        grad.addColorStop(0, o.color + '60');
        grad.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(x,y,r*2,0,Math.PI*2);
        ctx.fillStyle = grad; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle = o.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Label
      if (i === current) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px Syne, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(o.name, x, y + r + 18);
      }
    });
    // connector line
    ctx.beginPath();
    ctx.setLineDash([4,4]);
    ctx.strokeStyle = 'rgba(255,255,255,.15)';
    ctx.lineWidth = 1;
    objects.forEach((o,i) => {
      const logS = Math.log10(o.size);
      const t = (logS - logMin) / (logMax - logMin);
      const r = lerp(minR, maxR, t);
      const x = (i+1) * (W / (objects.length+1));
      if (i===0) ctx.moveTo(x, H/2); else ctx.lineTo(x, H/2);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  updateUniverse();
};

/* ─────────────────────────────────────────────────
   EXP 2: HUMAN LIFESPAN CALCULATOR
───────────────────────────────────────────────── */
EXPERIMENTS.lifespan = function(el) {
  el.innerHTML = `
    <h2>Human Lifespan Calculator</h2>
    <p class="exp-intro">Your life in numbers. Every week, every heartbeat — all laid out before you.</p>
    <div class="slider-wrap">
      <label>Your Age <span id="age-val">25</span></label>
      <input type="range" id="age-slider" min="0" max="100" value="25">
    </div>
    <div class="slider-wrap">
      <label>Life Expectancy <span id="expect-val">80</span></label>
      <input type="range" id="expect-slider" min="50" max="120" value="80">
    </div>
    <div class="big-num" id="weeks-left">—</div>
    <div class="big-num-label">weeks remaining in your life</div>
    <div class="stat-grid" id="life-stats"></div>
    <div class="divider"></div>
    <p style="font-size:.88rem;color:var(--text-dim);margin-bottom:16px;">Your life in weeks — each square is one week. <span style="color:var(--accent2)">■</span> lived &nbsp; <span style="color:var(--surface2)">■</span> remaining</p>
    <canvas id="weeks-canvas" height="0" style="border-radius:var(--radius);width:100%"></canvas>
    <div class="fact-box" id="life-fact"></div>
  `;

  const ageSlider    = document.getElementById('age-slider');
  const expectSlider = document.getElementById('expect-slider');
  const canvas = document.getElementById('weeks-canvas');
  const ctx = canvas.getContext('2d');

  function update() {
    const age    = parseInt(ageSlider.value);
    const expect = parseInt(expectSlider.value);
    document.getElementById('age-val').textContent    = age;
    document.getElementById('expect-val').textContent = expect;
    const totalWeeks = expect * 52;
    const livedWeeks = age * 52;
    const leftWeeks  = Math.max(0, totalWeeks - livedWeeks);
    document.getElementById('weeks-left').textContent = fmt(leftWeeks);

    const stats = [
      { v: fmt(leftWeeks * 7),        k: 'Days remaining' },
      { v: fmt(leftWeeks * 7 * 24),   k: 'Hours remaining' },
      { v: fmt(leftWeeks * 7 * 24 * 60 * 80), k: 'Heartbeats left' },
      { v: fmt(leftWeeks * 7 * 8),    k: 'Nights of sleep' },
      { v: fmt(leftWeeks * 7 * 3),    k: 'Meals to enjoy' },
      { v: fmt(leftWeeks * 7 * 24 * 60 * 15), k: 'Breaths remaining' },
    ];
    document.getElementById('life-stats').innerHTML = stats.map(s=>
      `<div class="stat-box"><div class="s-val">${s.v}</div><div class="s-key">${s.k}</div></div>`
    ).join('');

    const pct = Math.min(1, livedWeeks / totalWeeks);
    document.getElementById('life-fact').innerHTML = `
      You have lived <strong>${(pct*100).toFixed(1)}%</strong> of your estimated life.
      That's <strong>${fmt(livedWeeks)}</strong> weeks of experiences, memories, and growth.
      The best chapters may still be ahead.
    `;

    // Draw week grid
    const cols = 52;
    const rows = expect;
    const sz   = clamp(Math.floor((canvas.parentElement.offsetWidth - 32) / cols), 4, 12);
    const gap  = 1;
    canvas.width  = cols * (sz + gap);
    canvas.height = rows * (sz + gap);
    canvas.style.height = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const w = r * 52 + c;
        const x = c * (sz + gap);
        const y = r * (sz + gap);
        if (w < livedWeeks) {
          ctx.fillStyle = '#ff6ab0';
        } else {
          ctx.fillStyle = '#1e1e3a';
        }
        ctx.fillRect(x, y, sz, sz);
      }
    }
  }

  ageSlider.addEventListener('input', update);
  expectSlider.addEventListener('input', update);
  update();
};

/* ─────────────────────────────────────────────────
   EXP 3: AI FUTURE TIMELINE
───────────────────────────────────────────────── */
EXPERIMENTS.aitimeline = function(el) {
  const events = [
    { year:'1950', title:'Turing Test Proposed', body:'Alan Turing asks "Can machines think?" — laying the philosophical foundation for AI.' },
    { year:'1956', title:'AI is Born', body:'The Dartmouth Conference coins "Artificial Intelligence" as a field of research.' },
    { year:'1966', title:'ELIZA Chatbot', body:'Joseph Weizenbaum creates the first chatbot — people mistake it for human.' },
    { year:'1997', title:'Deep Blue Beats Kasparov', body:'IBM\'s chess computer defeats the reigning world champion, shocking the world.' },
    { year:'2011', title:'Watson Wins Jeopardy!', body:'IBM Watson defeats Jeopardy! champions — demonstrating language understanding.' },
    { year:'2012', title:'Deep Learning Revolution', body:'AlexNet wins ImageNet — kicking off the modern era of neural networks.' },
    { year:'2016', title:'AlphaGo Defeats Lee Sedol', body:'DeepMind\'s system masters Go — a game with more positions than atoms in the universe.' },
    { year:'2020', title:'GPT-3 Released', body:'175 billion parameters. Can write essays, code, and poetry with startling quality.' },
    { year:'2022', title:'Generative AI Explosion', body:'DALL-E, Stable Diffusion, and ChatGPT bring AI creativity to hundreds of millions.' },
    { year:'2024', title:'Multimodal Models Emerge', body:'AI can see, hear, read, and reason across all modalities simultaneously.' },
    { year:'2026 ★', title:'AI Agents Proliferate', body:'Autonomous AI agents handle complex multi-step tasks in the real world with minimal oversight.' },
    { year:'2028 ★', title:'Scientific Discovery Acceleration', body:'AI independently designs and validates experiments — compressing decades of research.' },
    { year:'2032 ★', title:'Economic Disruption',  body:'Automated knowledge work reshapes entire industries and redefines human productivity.' },
    { year:'2040 ★', title:'AGI Threshold Debate', body:'Machines match human performance across nearly all cognitive domains — raising profound questions.' },
    { year:'2050 ★', title:'Post-AGI World',       body:'A civilisation transformed. AI partners with humanity to tackle climate change, disease, and poverty.' },
  ];

  el.innerHTML = `
    <h2>AI Future Timeline</h2>
    <p class="exp-intro">From Turing's question to a post-AGI world — the journey of the most transformative technology in history. <span style="color:var(--accent)">★ = predicted</span></p>
    <div class="timeline" id="ai-timeline"></div>
    <div class="fact-box">The pace of AI progress has been accelerating exponentially. Events that once took decades now happen in months. The future is arriving faster than anyone predicted.</div>
  `;

  const tl = document.getElementById('ai-timeline');
  tl.innerHTML = events.map((e,i)=>`
    <div class="tl-item" data-i="${i}">
      <div class="tl-dot"></div>
      <div class="tl-year">${e.year}</div>
      <div class="tl-title">${e.title}</div>
      <div class="tl-body">${e.body}</div>
    </div>
  `).join('');

  // Stagger reveal
  const items = tl.querySelectorAll('.tl-item');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const i = parseInt(en.target.dataset.i);
        setTimeout(() => en.target.classList.add('reveal'), i * 60);
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(it => obs.observe(it));
};

/* ─────────────────────────────────────────────────
   EXP 4: MONEY GROWTH SIMULATOR
───────────────────────────────────────────────── */
EXPERIMENTS.money = function(el) {
  el.innerHTML = `
    <h2>Money Growth Simulator</h2>
    <p class="exp-intro">Albert Einstein allegedly called compound interest the "eighth wonder of the world." See why.</p>
    <div class="slider-wrap">
      <label>Initial Investment <span id="principal-val">$5,000</span></label>
      <input type="range" id="principal-slider" min="100" max="100000" step="100" value="5000">
    </div>
    <div class="slider-wrap">
      <label>Monthly Contribution <span id="monthly-val">$200</span></label>
      <input type="range" id="monthly-slider" min="0" max="5000" step="50" value="200">
    </div>
    <div class="slider-wrap">
      <label>Annual Return (%) <span id="rate-val">8%</span></label>
      <input type="range" id="rate-slider" min="1" max="30" step=".5" value="8">
    </div>
    <div class="slider-wrap">
      <label>Years <span id="years-val">30</span></label>
      <input type="range" id="years-slider" min="1" max="60" value="30">
    </div>
    <div class="stat-grid" id="money-stats"></div>
    <div class="canvas-wrap" style="padding:20px">
      <canvas id="money-chart" height="200"></canvas>
    </div>
    <div class="fact-box" id="money-fact"></div>
  `;

  const canvas = document.getElementById('money-chart');
  const ctx    = canvas.getContext('2d');

  function update() {
    const P = parseFloat(document.getElementById('principal-slider').value);
    const M = parseFloat(document.getElementById('monthly-slider').value);
    const r = parseFloat(document.getElementById('rate-slider').value) / 100;
    const Y = parseInt(document.getElementById('years-slider').value);

    document.getElementById('principal-val').textContent = '$' + P.toLocaleString();
    document.getElementById('monthly-val').textContent   = '$' + M.toLocaleString();
    document.getElementById('rate-val').textContent      = (r*100).toFixed(1) + '%';
    document.getElementById('years-val').textContent     = Y;

    const monthly_r = r / 12;
    let data = [], invested = [];
    let bal = P, dep = P;
    for (let i = 0; i <= Y * 12; i++) {
      bal = bal * (1 + monthly_r) + M;
      dep += M;
      if (i % 12 === 0) { data.push(bal); invested.push(dep); }
    }

    const final  = data[data.length-1];
    const invest = invested[invested.length-1];
    document.getElementById('money-stats').innerHTML = `
      <div class="stat-box"><div class="s-val" style="color:var(--green)">$${fmt(final)}</div><div class="s-key">Final Balance</div></div>
      <div class="stat-box"><div class="s-val">$${fmt(invest)}</div><div class="s-key">Total Invested</div></div>
      <div class="stat-box"><div class="s-val" style="color:var(--accent2)">$${fmt(final-invest)}</div><div class="s-key">Interest Earned</div></div>
      <div class="stat-box"><div class="s-val">${((final/invest-1)*100).toFixed(0)}%</div><div class="s-key">Return on Investment</div></div>
    `;

    if (final >= 1e6) unlockAchievement('money_millionaire');

    document.getElementById('money-fact').innerHTML =
      `For every <strong>$1</strong> you invested, compound interest turned it into <strong>$${(final/invest).toFixed(2)}</strong>. ` +
      `You contributed <strong>$${fmt(invest)}</strong> and the market gave you <strong>$${fmt(final-invest)}</strong> for free — thanks to time.`;

    // Draw chart
    canvas.width  = canvas.parentElement.offsetWidth - 40 || 700;
    canvas.height = 200;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    const maxVal = Math.max(...data);
    const pad = { l:10, r:10, t:10, b:28 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;

    // Grid
    for (let g=0;g<4;g++) {
      const y = pad.t + (g/3)*cH;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W-pad.r, y);
      ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth=1; ctx.stroke();
    }

    // Invested area
    ctx.beginPath();
    data.forEach((v,i) => {
      const x = pad.l + (i/(data.length-1))*cW;
      const y = pad.t + cH - (invested[i]/maxVal)*cH;
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.lineTo(W-pad.r, H-pad.b); ctx.lineTo(pad.l, H-pad.b);
    ctx.closePath();
    ctx.fillStyle = 'rgba(124,106,255,.2)'; ctx.fill();

    // Total area
    ctx.beginPath();
    data.forEach((v,i) => {
      const x = pad.l + (i/(data.length-1))*cW;
      const y = pad.t + cH - (v/maxVal)*cH;
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.lineTo(W-pad.r, H-pad.b); ctx.lineTo(pad.l, H-pad.b);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0, 'rgba(6,214,160,.5)');
    grad.addColorStop(1, 'rgba(6,214,160,.05)');
    ctx.fillStyle = grad; ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((v,i) => {
      const x = pad.l + (i/(data.length-1))*cW;
      const y = pad.t + cH - (v/maxVal)*cH;
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.strokeStyle = '#06d6a0'; ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round'; ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.font = '11px DM Sans';
    ctx.textAlign = 'center';
    [0, Math.floor(Y/2), Y].forEach(yr => {
      const i = Math.min(yr, data.length-1);
      const x = pad.l + (i/(data.length-1))*cW;
      ctx.fillText('Yr '+yr, x, H-6);
    });
  }

  ['principal-slider','monthly-slider','rate-slider','years-slider'].forEach(id => {
    document.getElementById(id).addEventListener('input', update);
  });
  update();
};

/* ─────────────────────────────────────────────────
   EXP 5: TIME TRAVEL VISUALIZATION
───────────────────────────────────────────────── */
EXPERIMENTS.timetravel = function(el) {
  const eras = [
    { year:-3000000000, label:'3 Billion BC',    color:'#f87171', emoji:'🌋', events:['Earth is still cooling','First single-celled life emerging','Oceans forming from cometary water','No oxygen in the atmosphere'] },
    { year:-66000000,   label:'66 Million BC',   color:'#fb923c', emoji:'🦕', events:['Dinosaurs dominate every continent','Asteroid Chicxulub impact imminent','Mammals are small, nocturnal creatures','Flowering plants are brand new'] },
    { year:-10000,      label:'10,000 BC',        color:'#34d399', emoji:'🏕️',  events:['End of the last ice age','Humans are hunter-gatherers','First signs of agriculture in Mesopotamia','Megafauna like mammoths still roam'] },
    { year:-3000,       label:'3,000 BC',         color:'#ffd166', emoji:'🏺', events:['Great Pyramid of Giza under construction','Sumerian writing system invented','Bronze Age begins','First cities emerge in Mesopotamia'] },
    { year:1,           label:'Year 1 AD',        color:'#a78bfa', emoji:'🏛️', events:['Roman Empire at its peak','Jesus of Nazareth begins ministry','Han Dynasty rules China','Silk Road trade at its height'] },
    { year:1440,        label:'1440 — Gutenberg', color:'#60a5fa', emoji:'📖', events:['Gutenberg invents the printing press','End of Middle Ages approaching','Columbus has not yet sailed','Ottoman Empire at height of power'] },
    { year:1776,        label:'1776',             color:'#4ade80', emoji:'🗽', events:['American Declaration of Independence','Age of Enlightenment flourishing','James Watt perfects the steam engine','Mozart composes his symphonies'] },
    { year:1969,        label:'1969',             color:'#7c6aff', emoji:'🚀', events:['First Moon Landing — Apollo 11','Vietnam War ongoing','Woodstock music festival','ARPANET (ancestor of internet) launched'] },
    { year:2000,        label:'2000',             color:'#6affe8', emoji:'💿', events:['Y2K bug narrowly averted','Human Genome Project nearing completion','Internet bubble at its peak','First iMacs and flat-panel TVs'] },
    { year:2025,        label:'2025 — Now',       color:'#ff6ab0', emoji:'🤖', events:['AI transforms every industry','Climate change is the defining challenge','Over 8 billion people on Earth','Space tourism has become real'] },
  ];

  let current = 9;

  el.innerHTML = `
    <h2>Time Travel Visualization</h2>
    <p class="exp-intro">Step into any moment in history. What was happening on Earth when your ancestors walked?</p>
    <div class="canvas-wrap"><canvas id="tt-canvas" height="90"></canvas></div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin:16px 0" id="era-btns"></div>
    <div id="era-display" style="animation:fadeIn .4s var(--ease-out)"></div>
  `;

  const canvas = document.getElementById('tt-canvas');
  const ctx    = canvas.getContext('2d');

  function drawTimeline() {
    canvas.width = canvas.parentElement.offsetWidth - 2 || 800;
    canvas.height = 90;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#10101e'; ctx.fillRect(0,0,W,H);
    const pad = 40;
    // line
    ctx.beginPath(); ctx.moveTo(pad, H/2); ctx.lineTo(W-pad, H/2);
    ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth=2; ctx.stroke();

    const minY = eras[0].year, maxY = eras[eras.length-1].year;
    eras.forEach((e,i) => {
      const t = (e.year - minY) / (maxY - minY);
      const x = pad + t*(W-pad*2);
      const isCur = i===current;
      ctx.beginPath(); ctx.arc(x, H/2, isCur?9:5, 0, Math.PI*2);
      ctx.fillStyle = e.color; ctx.globalAlpha = isCur?1:.5; ctx.fill();
      ctx.globalAlpha = 1;
      if (isCur) {
        ctx.beginPath(); ctx.arc(x, H/2, 14, 0, Math.PI*2);
        ctx.strokeStyle = e.color; ctx.lineWidth = 2; ctx.globalAlpha=.4; ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
  }

  function showEra() {
    const e = eras[current];
    document.getElementById('era-display').innerHTML = `
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
        <span style="font-size:3rem">${e.emoji}</span>
        <div>
          <div style="font-family:var(--font-disp);font-size:1.6rem;font-weight:800;color:${e.color}">${e.label}</div>
          <div style="font-size:.88rem;color:var(--text-dim)">What was happening on Earth</div>
        </div>
      </div>
      <div class="stat-grid" style="grid-template-columns:1fr 1fr">
        ${e.events.map(ev=>`<div class="stat-box"><div style="font-size:.9rem;font-weight:500">${ev}</div></div>`).join('')}
      </div>
    `;
    drawTimeline();
  }

  const btns = document.getElementById('era-btns');
  eras.forEach((e,i) => {
    const b = document.createElement('button');
    b.className = 'obj-btn' + (i===current?' active':'');
    b.textContent = e.emoji + ' ' + e.label;
    b.onclick = () => {
      current = i;
      document.querySelectorAll('#era-btns .obj-btn').forEach((x,xi) => x.classList.toggle('active',xi===i));
      document.getElementById('era-display').style.animation = 'none';
      requestAnimationFrame(() => {
        document.getElementById('era-display').style.animation = 'fadeIn .4s var(--ease-out)';
        showEra();
      });
    };
    btns.appendChild(b);
  });

  showEra();
};

/* ─────────────────────────────────────────────────
   EXP 6: INTERNET DATA FLOW
───────────────────────────────────────────────── */
EXPERIMENTS.internet = function(el) {
  el.innerHTML = `
    <h2>Internet Data Flow</h2>
    <p class="exp-intro">Every second, the internet carries a staggering flood of data. Watch it flow — live.</p>
    <div class="canvas-wrap"><canvas id="flow-canvas" height="260"></canvas></div>
    <div id="counters" class="stat-grid"></div>
    <div class="fact-box">In the time it took you to read this sentence, the internet moved enough data to fill thousands of hard drives. The global internet carries roughly <strong>5 exabytes</strong> of data every day — that's 5 billion gigabytes.</div>
  `;

  const canvas = document.getElementById('flow-canvas');
  const ctx    = canvas.getContext('2d');

  // Stats per second
  const dataItems = [
    { label:'Emails sent',          perSec: 3400000,   color:'#7c6aff', emoji:'📧' },
    { label:'Google searches',      perSec: 99000,     color:'#ffd166', emoji:'🔍' },
    { label:'YouTube minutes uploaded', perSec:500,    color:'#f87171', emoji:'📺' },
    { label:'Tweets posted',        perSec: 6000,      color:'#60a5fa', emoji:'🐦' },
    { label:'GB of data transferred',perSec:127000,    color:'#06d6a0', emoji:'💾' },
    { label:'WhatsApp messages',    perSec: 200000,    color:'#34d399', emoji:'💬' },
  ];

  let elapsed = 0;
  let particles = [];
  let lastTime = null;

  canvas.width  = canvas.parentElement.offsetWidth - 2 || 700;
  canvas.height = 260;
  const W = canvas.width, H = canvas.height;

  // Init particles
  const COLORS = ['#7c6aff','#ff6ab0','#6affe8','#ffd166','#06d6a0','#60a5fa'];
  function spawnParticle() {
    particles.push({
      x: rand(0, W),
      y: H + 10,
      vx: rand(-1.5, 1.5),
      vy: rand(-3, -1),
      r: rand(2, 5),
      c: COLORS[Math.floor(rand(0, COLORS.length))],
      life: 1,
    });
  }

  function animFlow(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    elapsed += dt;

    // Spawn
    for (let i = 0; i < 8; i++) spawnParticle();

    ctx.fillStyle = 'rgba(8,8,15,.3)';
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.02; // drift
      p.life -= 0.008;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.c; ctx.globalAlpha = p.life;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter(p => p.life > 0 && p.y > -20);

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.font = '13px DM Sans';
    ctx.textAlign = 'center';
    ctx.fillText('Data streaming in real time ↑', W/2, 22);

    // Update counters
    document.getElementById('counters').innerHTML = dataItems.map(d=>`
      <div class="stat-box">
        <div class="s-val">${d.emoji} ${fmt(Math.floor(d.perSec * elapsed))}</div>
        <div class="s-key">${d.label}</div>
      </div>
    `).join('');

    requestAnimationFrame(animFlow);
  }
  requestAnimationFrame(animFlow);
};

/* ─────────────────────────────────────────────────
   EXP 7: SPACE DISTANCE EXPLORER
───────────────────────────────────────────────── */
EXPERIMENTS.space = function(el) {
  const bodies = [
    { name:'Moon',     dist:384400,    color:'#d1d5db', emoji:'🌕', fact:'The Moon is close enough that radio signals take only 1.3 seconds to reach it.' },
    { name:'Mars',     dist:225000000, color:'#f87171', emoji:'🔴', fact:'Mars distance varies enormously — from 56M to 401M km depending on orbits.' },
    { name:'Jupiter',  dist:778500000, color:'#fb923c', emoji:'🪐', fact:'Jupiter is so massive its gravity shields inner planets from many asteroid impacts.' },
    { name:'Saturn',   dist:1432000000,color:'#fde68a', emoji:'💍', fact:'Saturn\'s rings are made of ice and rock, extending 282,000 km but only metres thick.' },
    { name:'Uranus',   dist:2867000000,color:'#6affe8', emoji:'🔵', fact:'Uranus rotates on its side — likely from a massive ancient collision.' },
    { name:'Neptune',  dist:4515000000,color:'#3b82f6', emoji:'🌊', fact:'Neptune was discovered by mathematics before it was ever observed through a telescope.' },
    { name:'Pluto',    dist:5906000000,color:'#a78bfa', emoji:'🟣', fact:'It takes 5+ hours for the Sun\'s light to reach Pluto. We\'ve only visited once.' },
  ];

  let selected = 0;

  el.innerHTML = `
    <h2>Space Distance Explorer</h2>
    <p class="exp-intro">Space is almost incomprehensibly vast. How long would it take to get there — at the speed of a car?</p>
    <div class="planet-select" id="planet-sel"></div>
    <div class="canvas-wrap"><canvas id="space-canvas" height="160"></canvas></div>
    <div class="big-num" id="sp-years">—</div>
    <div class="big-num-label" id="sp-label">years driving at 100 km/h</div>
    <div class="stat-grid" id="sp-stats"></div>
    <div class="fact-box" id="sp-fact"></div>
  `;

  const canvas = document.getElementById('space-canvas');
  const ctx    = canvas.getContext('2d');

  function drawSpace() {
    canvas.width  = canvas.parentElement.offsetWidth - 2 || 700;
    canvas.height = 160;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#05050f'; ctx.fillRect(0,0,W,H);
    // Stars
    for (let i=0;i<60;i++) {
      ctx.beginPath(); ctx.arc(rand(0,W),rand(0,H), rand(.3,1.5), 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${rand(.1,.6)})`; ctx.fill();
    }
    // Sun
    const sunX = 60, sunY = H/2;
    const sg = ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,35);
    sg.addColorStop(0,'#ffd166'); sg.addColorStop(.4,'#fb923c'); sg.addColorStop(1,'transparent');
    ctx.beginPath(); ctx.arc(sunX,sunY,35,0,Math.PI*2); ctx.fillStyle=sg; ctx.fill();

    // Planet positions (log scale)
    const minDist = Math.log10(bodies[0].dist);
    const maxDist = Math.log10(bodies[bodies.length-1].dist);
    bodies.forEach((b,i) => {
      const t = (Math.log10(b.dist) - minDist) / (maxDist - minDist);
      const x = sunX + 80 + t*(W - sunX - 100);
      const isSel = i === selected;
      const r = isSel ? 14 : 8;
      ctx.beginPath(); ctx.arc(x, H/2, r, 0, Math.PI*2);
      ctx.fillStyle = b.color; ctx.globalAlpha = isSel ? 1 : 0.4; ctx.fill();
      ctx.globalAlpha = 1;
      // dashed line to sun
      if (isSel) {
        ctx.beginPath(); ctx.setLineDash([4,4]);
        ctx.moveTo(sunX+35, H/2); ctx.lineTo(x-r, H/2);
        ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth=1; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle='#fff'; ctx.font='bold 12px DM Sans'; ctx.textAlign='center';
        ctx.fillText(b.emoji+' '+b.name, x, H/2+r+18);
      }
    });
  }

  function updateSpace() {
    const b = bodies[selected];
    const hoursToArrive = b.dist / 100;
    const years = hoursToArrive / 8760;
    document.getElementById('sp-years').textContent = years >= 1 ? fmt(years) : (hoursToArrive / 24).toFixed(0);
    document.getElementById('sp-label').textContent = years >= 1 ? 'years driving at 100 km/h' : 'days driving at 100 km/h';
    const lightSeconds = b.dist / 299792;
    document.getElementById('sp-stats').innerHTML = `
      <div class="stat-box"><div class="s-val">${(b.dist/1e6).toFixed(1)}M</div><div class="s-key">km from Earth</div></div>
      <div class="stat-box"><div class="s-val">${lightSeconds < 60 ? lightSeconds.toFixed(0)+'s' : (lightSeconds/60).toFixed(1)+'m'}</div><div class="s-key">Light travel time</div></div>
      <div class="stat-box"><div class="s-val">${fmt(b.dist/1.5)}</div><div class="s-key">Astronomical units</div></div>
    `;
    document.getElementById('sp-fact').innerHTML = `<strong>${b.emoji} ${b.name}</strong> — ${b.fact}`;
    drawSpace();
  }

  const pSel = document.getElementById('planet-sel');
  bodies.forEach((b,i) => {
    const btn = document.createElement('button');
    btn.className = 'planet-btn' + (i===selected?' active':'');
    btn.textContent = b.emoji + ' ' + b.name;
    btn.onclick = () => {
      selected = i;
      document.querySelectorAll('.planet-btn').forEach((x,xi)=>x.classList.toggle('active',xi===i));
      updateSpace();
    };
    pSel.appendChild(btn);
  });
  updateSpace();
};

/* ─────────────────────────────────────────────────
   EXP 8: PRODUCTIVITY CHALLENGE GAME
───────────────────────────────────────────────── */
EXPERIMENTS.game = function(el) {
  el.innerHTML = `
    <h2>Productivity Challenge</h2>
    <p class="exp-intro">Click ✅ tasks, avoid ❌ distractions. You have 30 seconds. How focused are you?</p>
    <div class="game-hud">
      <div class="game-hud-item"><div class="hud-v" id="g-score">0</div><div class="hud-k">Score</div></div>
      <div class="game-hud-item"><div class="hud-v" id="g-time">30</div><div class="hud-k">Seconds</div></div>
      <div class="game-hud-item"><div class="hud-v" id="g-streak">0</div><div class="hud-k">Streak</div></div>
      <div class="game-hud-item"><div class="hud-v" id="g-hi">0</div><div class="hud-k">High Score</div></div>
    </div>
    <div id="game-area" class="canvas-wrap" style="min-height:360px;padding:0;overflow:hidden"></div>
    <div style="text-align:center;margin-top:16px">
      <button class="btn btn-primary" id="start-btn" onclick="window._gameStart()">▶ Start Game</button>
    </div>
    <div id="game-msg" style="text-align:center;padding:20px;font-size:1.1rem;color:var(--text-dim)">Press Start to begin!</div>
  `;

  const area   = document.getElementById('game-area');
  const GOODS  = ['✅','📋','⭐','📌','🎯','✔️','📝','🏆'];
  const BADS   = ['❌','💤','🎮','📱','🎵','🎲','😴','🍕'];
  let score = 0, streak = 0, timer = 30, hi = 0, running = false, interval = null, spawnI = null;

  window._gameStart = function() {
    if (running) return;
    score = 0; streak = 0; timer = 30; running = true;
    area.innerHTML = '';
    document.getElementById('game-msg').textContent = '';
    document.getElementById('start-btn').disabled = true;

    interval = setInterval(() => {
      timer--;
      document.getElementById('g-time').textContent = timer;
      if (timer <= 0) endGame();
    }, 1000);
    spawnI = setInterval(spawnTarget, 600);
  };

  function spawnTarget() {
    const isGood = Math.random() > 0.38;
    const emoji  = isGood ? GOODS[Math.floor(Math.random()*GOODS.length)] : BADS[Math.floor(Math.random()*BADS.length)];
    const size   = 48 + Math.random() * 28;
    const x = Math.random() * (area.offsetWidth  - size - 10);
    const y = Math.random() * (area.offsetHeight - size - 10);
    const el2 = document.createElement('div');
    el2.className = 'game-target';
    el2.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${isGood?'rgba(6,214,160,.2)':'rgba(248,113,113,.2)'};border:2px solid ${isGood?'#06d6a0':'#f87171'};font-size:${size*.55}px`;
    el2.textContent = emoji;
    el2.onclick = () => {
      if (!running) return;
      if (isGood) {
        score += 1 + Math.floor(streak / 3);
        streak++;
        showFloaty('+' + (1 + Math.floor((streak-1)/3)), el2, '#06d6a0');
      } else {
        streak = 0;
        score = Math.max(0, score - 2);
        showFloaty('-2', el2, '#f87171');
      }
      document.getElementById('g-score').textContent  = score;
      document.getElementById('g-streak').textContent = streak;
      el2.remove();
    };
    area.appendChild(el2);
    setTimeout(() => el2.remove(), 2200);
  }

  function showFloaty(text, ref, color) {
    const f = document.createElement('div');
    f.style.cssText = `position:absolute;font-family:var(--font-disp);font-weight:800;font-size:1.2rem;color:${color};pointer-events:none;z-index:100;left:${ref.style.left};top:${ref.style.top};animation:fadeUp .7s forwards`;
    f.textContent = text;
    area.appendChild(f);
    setTimeout(() => f.remove(), 700);
  }

  function endGame() {
    running = false;
    clearInterval(interval); clearInterval(spawnI);
    area.innerHTML = '';
    if (score > hi) {
      hi = score;
      document.getElementById('g-hi').textContent = hi;
      document.getElementById('game-msg').innerHTML = `<strong style="color:var(--gold)">🏆 New High Score: ${hi}!</strong>`;
      if (hi >= 15) unlockAchievement('game_score');
    } else {
      document.getElementById('game-msg').innerHTML = `Game over! You scored <strong style="color:var(--accent)">${score}</strong>. Best: ${hi}`;
    }
    document.getElementById('start-btn').disabled = false;
    document.getElementById('start-btn').textContent = '↺ Play Again';
  }
};

/* ─────────────────────────────────────────────────
   EXP 9: WORLD POPULATION VISUALIZER
───────────────────────────────────────────────── */
EXPERIMENTS.population = function(el) {
  const popData = [
    { year:1, pop:300e6 },
    { year:1000, pop:310e6 },
    { year:1500, pop:500e6 },
    { year:1700, pop:682e6 },
    { year:1800, pop:1e9 },
    { year:1900, pop:1.6e9 },
    { year:1950, pop:2.5e9 },
    { year:1970, pop:3.7e9 },
    { year:1990, pop:5.3e9 },
    { year:2000, pop:6.1e9 },
    { year:2010, pop:6.9e9 },
    { year:2020, pop:7.8e9 },
    { year:2024, pop:8.1e9 },
    { year:2050, pop:9.7e9 },
    { year:2100, pop:10.4e9 },
  ];

  el.innerHTML = `
    <h2>World Population Visualizer</h2>
    <p class="exp-intro">Every dot below represents <strong>1 million people</strong>. Watch humanity grow.</p>
    <div class="slider-wrap">
      <label>Year <span id="pop-year-val">2024</span></label>
      <input type="range" id="pop-year" min="0" max="14" value="12" step="1">
    </div>
    <div class="big-num" id="pop-num">—</div>
    <div class="big-num-label">people alive on Earth</div>
    <div class="canvas-wrap"><canvas id="pop-canvas" height="280"></canvas></div>
    <div class="stat-grid" id="pop-stats"></div>
    <div class="fact-box" id="pop-fact"></div>
  `;

  const canvas = document.getElementById('pop-canvas');
  const ctx    = canvas.getContext('2d');

  function update() {
    const idx = parseInt(document.getElementById('pop-year').value);
    const d   = popData[idx];
    document.getElementById('pop-year-val').textContent = d.year > 2024 ? d.year + ' (projected)' : d.year;
    document.getElementById('pop-num').textContent = (d.pop/1e9).toFixed(2) + 'B';

    const prev = idx > 0 ? popData[idx-1] : null;
    const growth = prev ? ((d.pop - prev.pop)/prev.pop*100).toFixed(1) : 'N/A';
    document.getElementById('pop-stats').innerHTML = `
      <div class="stat-box"><div class="s-val">${(d.pop/1e9).toFixed(2)}B</div><div class="s-key">Total Population</div></div>
      <div class="stat-box"><div class="s-val">${growth}%</div><div class="s-key">Growth since previous marker</div></div>
      <div class="stat-box"><div class="s-val">${fmt(d.pop/510e9*100)}%</div><div class="s-key">People per km² avg</div></div>
    `;

    const facts = [
      'It took all of human history to reach 1 billion people (around 1804). We added the next billion in just 123 years.',
      'In 1950, the world had 2.5 billion people. By 2024 it tripled to over 8 billion in just 74 years.',
      'Global population growth is slowing — by 2100 it may stabilise around 10–11 billion.',
      'Half the world\'s population lives in just 8 countries.',
    ];
    document.getElementById('pop-fact').innerHTML = facts[Math.floor(Math.random() * facts.length)];

    drawDots(d.pop);
  }

  function drawDots(pop) {
    canvas.width  = canvas.parentElement.offsetWidth - 2 || 700;
    canvas.height = 280;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#0a0a18'; ctx.fillRect(0,0,W,H);

    const MILLI = 1e6;
    const total = Math.round(pop / MILLI);
    const dotR  = clamp(Math.floor(W / Math.sqrt(total) / 1.8), 2, 8);
    const cols  = Math.floor(W / (dotR*2.2));
    const rows  = Math.ceil(total / cols);
    const gapX  = (W - cols * dotR*2) / (cols + 1);
    const gapY  = (H - rows * dotR*2) / (rows + 1);

    const HUE_STEPS = ['#6affe8','#7c6aff','#ff6ab0','#ffd166','#06d6a0','#60a5fa'];
    let drawn = 0;
    for (let r = 0; r < rows && drawn < total; r++) {
      for (let c = 0; c < cols && drawn < total; c++) {
        const x = gapX + c*(dotR*2+gapX) + dotR;
        const y = gapY + r*(dotR*2+Math.max(gapY,1)) + dotR;
        ctx.beginPath(); ctx.arc(x, y, dotR, 0, Math.PI*2);
        ctx.fillStyle = HUE_STEPS[drawn % HUE_STEPS.length];
        ctx.globalAlpha = .7; ctx.fill();
        drawn++;
      }
    }
    ctx.globalAlpha = 1;

    // Label
    ctx.fillStyle='rgba(255,255,255,.4)'; ctx.font='12px DM Sans'; ctx.textAlign='center';
    ctx.fillText('Each dot = 1 million people', W/2, H-8);
  }

  document.getElementById('pop-year').addEventListener('input', update);
  update();
};

/* ─────────────────────────────────────────────────
   EXP 10: DREAM CAREER ROADMAP
───────────────────────────────────────────────── */
EXPERIMENTS.career = function(el) {
  const careers = {
    'Software Engineer': {
      salary: '$110K–$250K',
      years: '2–4 years to entry-level',
      steps: [
        { title:'Learn Programming Fundamentals', body:'Master Python or JavaScript. Complete freeCodeCamp, CS50, or The Odin Project. Build 3 small projects.' },
        { title:'Study Data Structures & Algorithms', body:'LeetCode, Neetcode.io — solve 150 core problems. Understand time complexity.' },
        { title:'Build a Portfolio', body:'Create 3–5 substantial projects: a full-stack web app, an API, a tool you actually use.' },
        { title:'Land First Job', body:'Apply to 50–100 positions. Attend local meetups. Contribute to open source. Network on LinkedIn.' },
        { title:'Senior Engineer Path', body:'After 3–5 years: mentor juniors, lead architecture decisions, push for Staff/Principal track.' },
      ],
    },
    'Data Scientist': {
      salary: '$95K–$200K',
      years: '2–4 years (often needs MSc)',
      steps: [
        { title:'Statistics & Mathematics', body:'Study probability, linear algebra, calculus. Coursera\'s Math for ML specialisation is excellent.' },
        { title:'Python for Data Science', body:'Master NumPy, Pandas, Scikit-learn, and Matplotlib. Kaggle competitions are invaluable practice.' },
        { title:'Machine Learning Theory', body:'Andrew Ng\'s ML course. Understand regression, classification, clustering, neural networks.' },
        { title:'Build Data Projects', body:'Scrape and analyse real datasets. Publish on GitHub and Kaggle. Write blog posts explaining your findings.' },
        { title:'Specialise', body:'Choose NLP, computer vision, or MLOps. An MSc or bootcamp accelerates your path significantly.' },
      ],
    },
    'UX Designer': {
      salary: '$75K–$170K',
      years: '1–3 years to first role',
      steps: [
        { title:'Learn Design Principles', body:'Study typography, colour theory, gestalt principles, and visual hierarchy. Google\'s UX Certificate is a great start.' },
        { title:'Master Figma', body:'Figma is industry-standard. Learn auto-layout, components, prototyping, and design systems.' },
        { title:'Study User Research', body:'Conduct usability tests, user interviews, and surveys. Learn to synthesise insights into actionable decisions.' },
        { title:'Build a Portfolio', body:'Design 3 case studies showing your full process: research → wireframes → prototype → testing → iteration.' },
        { title:'Get Hired & Grow', body:'Target product-led companies. Aim for UX → Senior UX → Lead → Head of Design track.' },
      ],
    },
    'Entrepreneur': {
      salary: '$0–Unlimited',
      years: '2–10 years to meaningful success',
      steps: [
        { title:'Build Skills First', body:'Get 2–3 years of industry experience. Learn sales, product, and at least one technical skill.' },
        { title:'Find a Real Problem', body:'Talk to 100 potential customers before writing a line of code. Validate pain points, not solutions.' },
        { title:'Build an MVP', body:'Launch the simplest version in 90 days. Done is better than perfect. Charge from day one.' },
        { title:'Get First 10 Customers', body:'Sell manually. Cold email, DM, attend events. Every "no" teaches you something a "yes" never would.' },
        { title:'Scale', body:'Once you have product-market fit: hire, fundraise or bootstrap, and build systems that run without you.' },
      ],
    },
    'Doctor': {
      salary: '$200K–$600K',
      years: '10–15 years including residency',
      steps: [
        { title:'Pre-Medical Undergraduate', body:'Study biology, chemistry, physics. Maintain a 3.7+ GPA. Shadow physicians for 200+ hours.' },
        { title:'MCAT & Medical School Applications', body:'Score 515+ on the MCAT. Apply broadly — top schools accept <5% of applicants.' },
        { title:'4 Years of Medical School', body:'Two years of foundational science, two years of clinical rotations across every specialty.' },
        { title:'Residency (3–7 Years)', body:'Match into your chosen specialty. Long hours, intense learning, and finally earning a real salary.' },
        { title:'Fellowship & Practice', body:'Optional subspecialty fellowship (1–3 years). Then: private practice, hospital, or academia.' },
      ],
    },
    'Artist / Creator': {
      salary: '$20K–$500K+',
      years: 'Ongoing — start today',
      steps: [
        { title:'Develop Your Craft Daily', body:'Commit to daily practice. Study masters. Finish projects even when they feel bad. Quantity drives quality.' },
        { title:'Find Your Voice', body:'Experiment across mediums and styles until something feels distinctly yours. Steal like an artist.' },
        { title:'Build an Audience', body:'Post consistently on 1–2 platforms. Engage genuinely. Play long games — most overnight successes took 10 years.' },
        { title:'Monetise Your Work', body:'Prints, commissions, courses, licensing, Patreon, brand deals. Diversify income streams.' },
        { title:'Go Full-Time', body:'Replace 6 months of income before quitting your day job. Build the life where creating is your work.' },
      ],
    },
  };

  el.innerHTML = `
    <h2>Dream Career Roadmap</h2>
    <p class="exp-intro">Pick your dream career and get a personalised roadmap. Every expert was once a beginner.</p>
    <select class="career-select" id="career-sel">
      ${Object.keys(careers).map(c=>`<option value="${c}">${c}</option>`).join('')}
    </select>
    <div class="stat-grid" id="career-stats"></div>
    <div id="career-steps"></div>
  `;

  function update() {
    const key = document.getElementById('career-sel').value;
    const c   = careers[key];
    document.getElementById('career-stats').innerHTML = `
      <div class="stat-box"><div class="s-val" style="color:var(--green)">${c.salary}</div><div class="s-key">Typical salary range</div></div>
      <div class="stat-box"><div class="s-val">${c.years}</div><div class="s-key">Timeline estimate</div></div>
    `;
    document.getElementById('career-steps').innerHTML = c.steps.map((s,i)=>`
      <div class="career-card" style="animation-delay:${i*60}ms;animation:fadeIn .4s ${i*60}ms both">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <span style="background:var(--accent);color:#fff;border-radius:50%;width:26px;height:26px;display:grid;place-items:center;font-size:.8rem;font-weight:800;flex-shrink:0">${i+1}</span>
          <h4 style="margin:0">${s.title}</h4>
        </div>
        <p>${s.body}</p>
      </div>
    `).join('');
  }

  document.getElementById('career-sel').addEventListener('change', update);
  update();
};

// ────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────
// Night owl check
if (new Date().getHours() >= 0 && new Date().getHours() < 5) {
  setTimeout(() => unlockAchievement('night_owl'), 2000);
}

console.log('%c∞ Infinity Playground', 'font-size:2rem;font-weight:bold;background:linear-gradient(135deg,#7c6aff,#ff6ab0);-webkit-background-clip:text;-webkit-text-fill-color:transparent');
console.log('%cHint: Try typing "infinity" on your keyboard for a surprise 👀', 'color:#7c6aff;font-size:.95rem');
console.log('%cKonami Code works too: ↑↑↓↓←→←→BA', 'color:#6affe8;font-size:.9rem');
