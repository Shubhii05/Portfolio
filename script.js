// ===========================
// ===== PARTICLE CANVAS =====
// ===========================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const COUNT = 70;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

function initParticles() {
  particles = [];
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.45 + 0.08,
      cyan: Math.random() > 0.55,
    });
  }
}
initParticles();

let mouseX = -9999, mouseY = -9999;
window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.hypot(dx, dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,240,255,${0.07 * (1 - d / 110)})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  particles.forEach(p => {
    // Mouse attract
    const dx = mouseX - p.x, dy = mouseY - p.y;
    const d  = Math.hypot(dx, dy);
    if (d < 130) { p.vx += (dx / d) * 0.02; p.vy += (dy / d) * 0.02; }

    // Damping
    p.vx *= 0.978; p.vy *= 0.978;
    p.x  += p.vx;  p.y  += p.vy;

    // Wrap
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width)  p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.cyan
      ? `rgba(0,240,255,${p.alpha})`
      : `rgba(255,255,255,${p.alpha * 0.5})`;
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();

// =========================
// ===== MUSIC PLAYER ======
// =========================
const audio       = document.getElementById('bg-music');
const musicBtn    = document.getElementById('music-toggle');
const musicIconEl = document.getElementById('music-icon-el');
const player      = document.getElementById('music-player');
const titleEl     = document.getElementById('music-title');
const artistEl    = document.getElementById('music-artist');

let isPlaying = false;
let audioReady = false;

if (audio) {
  audio.volume = 0.75;
  audio.addEventListener('canplaythrough', () => { audioReady = true; });
  audio.addEventListener('error', () => {
    audioReady = false;
    if (artistEl) artistEl.textContent = 'Add audio/ambient.mp3';
    if (titleEl) titleEl.textContent = 'Track unavailable';
  });
}

musicBtn?.addEventListener('click', async () => {
  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    musicIconEl.className = 'fas fa-play';
    player.classList.remove('music-playing');
    isPlaying = false;
    return;
  }

  if (!audioReady && audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
    if (titleEl) titleEl.textContent = 'No track loaded';
    if (artistEl) artistEl.textContent = 'Place ambient.mp3 in /audio';
    return;
  }

  try {
    await audio.play();
    musicIconEl.className = 'fas fa-pause';
    player.classList.add('music-playing');
    isPlaying = true;
    if (titleEl) titleEl.textContent = 'Lofi · Ambient Dev';
    if (artistEl) artistEl.textContent = 'Now playing';
  } catch (err) {
    console.warn('Playback failed:', err);
    if (titleEl) titleEl.textContent = 'Click to retry ▶';
  }
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HAMBURGER =====
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
const bars      = hamburger?.querySelectorAll('span') ?? [];

const syncIcon = open => {
  if (bars.length < 3) return;
  bars[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
  bars[1].style.opacity   = open ? '0' : '1';
  bars[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
};

hamburger?.addEventListener('click', toggleMenu);
hamburger?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggleMenu(); });
function toggleMenu() {
  const open = navLinks.classList.toggle('open');
  syncIcon(open);
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => { navLinks.classList.remove('open'); syncIcon(false); });
});

// ===== TYPING ANIMATION =====
const typingEl = document.getElementById('typingText');
const phrases  = [
  'build_scalable_backends()',
  'craft_elegant_UIs()',
  'explore_AI_and_ML()',
  'solve_distributed_systems()',
  'write_clean_cpp_code()',
];
let pIdx = 0, cIdx = 0, deleting = false;

function type() {
  const cur = phrases[pIdx];
  if (!deleting) {
    typingEl.textContent = cur.slice(0, ++cIdx);
    if (cIdx === cur.length) { deleting = true; setTimeout(type, 2200); return; }
  } else {
    typingEl.textContent = cur.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(type, 380); return; }
  }
  setTimeout(type, deleting ? 38 : 62);
}
setTimeout(type, 1000);

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== ACTIVE NAV =====
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navAnchors.forEach(a => { a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--cyan)' : ''; });
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => secObs.observe(s));

// ===== CONTACT FORM =====
const form       = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const setStatus  = (msg, color) => { if (formStatus) { formStatus.textContent = msg; formStatus.style.color = color; } };

form?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn      = form.querySelector('.btn-send');
  const origHTML = btn.innerHTML;
  const endpoint = form.dataset.formEndpoint?.trim();
  if (!endpoint) { setStatus('Endpoint missing.', '#ff6b6b'); return; }

  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  setStatus('Transmitting…', '#7a8aaa');

  try {
    const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error();
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = 'linear-gradient(135deg, #00ff88, #00c862)';
    setStatus('// Message received — I\'ll reply soon!', '#00ff88');
    form.reset();
  } catch {
    btn.innerHTML = origHTML;
    setStatus('// Error — try emailing me directly.', '#ff2d78');
  } finally {
    btn.disabled = false;
    setTimeout(() => { btn.innerHTML = origHTML; btn.style.background = ''; }, 4000);
  }
});

// ===== FOOTER YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== PROJECTS HORIZONTAL SHOWCASE =====
const projectsTrack = document.getElementById('projectsTrack');
const projectsPrev  = document.getElementById('projectsPrev');
const projectsNext  = document.getElementById('projectsNext');
const projectsDots  = document.querySelectorAll('.projects-dot');

const scrollToProject = index => {
  if (!projectsTrack) return;
  const slide = projectsTrack.children[index];
  if (!slide) return;
  slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
};

const syncProjectDots = () => {
  if (!projectsTrack || !projectsDots.length) return;
  const w = projectsTrack.clientWidth || 1;
  const idx = Math.round(projectsTrack.scrollLeft / w);
  projectsDots.forEach((dot, i) => {
    const active = i === idx;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-selected', active ? 'true' : 'false');
  });
};

projectsPrev?.addEventListener('click', () => {
  const w = projectsTrack.clientWidth || 1;
  const idx = Math.max(0, Math.round(projectsTrack.scrollLeft / w) - 1);
  scrollToProject(idx);
});

projectsNext?.addEventListener('click', () => {
  const w = projectsTrack.clientWidth || 1;
  const max = projectsTrack.children.length - 1;
  const idx = Math.min(max, Math.round(projectsTrack.scrollLeft / w) + 1);
  scrollToProject(idx);
});

projectsDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = Number(dot.dataset.index);
    if (!Number.isNaN(index)) scrollToProject(index);
  });
});

projectsTrack?.addEventListener('scroll', () => {
  window.requestAnimationFrame(syncProjectDots);
}, { passive: true });

syncProjectDots();

// ===== SKILLS SYSTEM MAP =====
(() => {
  const svg = document.getElementById('skillsMap');
  const caption = document.getElementById('skillsCaption');
  if (!svg || !caption) return;

  const NS = 'http://www.w3.org/2000/svg';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cols = [
    ['interface', [['React', 'renders the UI and keeps state in sync'], ['HTML / CSS', 'structure and styling, hand-written'], ['Bootstrap', 'fast responsive layout']]],
    ['gateway', [['Crow (C++)', 'a C++ web framework for serving HTTP'], ['REST APIs', 'clean contracts between client and server'], ['JavaScript', 'glue for the browser and Node']]],
    ['queue & core', [['Redis', 'in-memory queue, cache and coordination'], ['Distributed Systems', 'splitting work across machines safely'], ['Operating Systems', 'threads, processes and scheduling underneath it all']]],
    ['workers', [['C++ (STL)', 'fast workers with the standard library'], ['DSA', 'the right data structure for the job'], ['OOP & STL', 'clean abstractions that stay readable']]],
    ['state', [['PostgreSQL', 'relational source of truth'], ['MySQL', 'relational storage, the other flavour'], ['AWS', 'where it all runs and scales']]],
  ];
  const tools = [['Docker', 'packages it'], ['Git / GitHub', 'tracks it'], ['CMake', 'builds the C++'], ['VS Code', 'where I write it']];
  const cx = [100, 300, 500, 700, 900];
  const cy = [140, 230, 320];
  const W = 150;
  const H = 44;

  const el = (name, attrs = {}, parent = svg) => {
    const node = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    parent.appendChild(node);
    return node;
  };

  const nodes = [];
  const edges = [];
  const gEdges = el('g');
  const gNodes = el('g');
  const gPackets = el('g');

  cols.forEach(([title, items], colIndex) => {
    const colGroup = el('g', { class: 'skills-map-col' });
    const label = el('text', { x: cx[colIndex], y: 68, 'text-anchor': 'middle' }, colGroup);
    label.textContent = title;

    items.forEach(([name, desc], rowIndex) => {
      const node = el('g', { class: 'skills-map-node', tabindex: '0', role: 'button', 'aria-label': `${name}: ${desc}` }, gNodes);
      el('rect', { x: cx[colIndex] - W / 2, y: cy[rowIndex] - H / 2, width: W, height: H, rx: 10 }, node);
      const text = el('text', { x: cx[colIndex], y: cy[rowIndex] }, node);
      text.textContent = name;

      const skill = { node, colIndex, rowIndex, name, desc, out: [], inn: [], x: cx[colIndex], y: cy[rowIndex] };
      nodes.push(skill);
      node.addEventListener('mouseenter', () => focusSkill(skill));
      node.addEventListener('focus', () => focusSkill(skill));
      node.addEventListener('click', () => focusSkill(skill));
      node.addEventListener('mouseleave', releaseSkill);
      node.addEventListener('blur', releaseSkill);
    });
  });

  const at = (colIndex, rowIndex) => nodes.find(skill => skill.colIndex === colIndex && skill.rowIndex === rowIndex);

  for (let colIndex = 0; colIndex < 4; colIndex++) {
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      [rowIndex, (rowIndex + 1) % 3].forEach(nextRow => {
        const a = at(colIndex, rowIndex);
        const b = at(colIndex + 1, nextRow);
        const x1 = a.x + W / 2;
        const x2 = b.x - W / 2;
        const mid = (x1 + x2) / 2;
        const path = el('path', { class: 'skills-map-edge', d: `M${x1} ${a.y}C${mid} ${a.y} ${mid} ${b.y} ${x2} ${b.y}` }, gEdges);
        const edge = { path, a, b };
        edges.push(edge);
        a.out.push(edge);
        b.inn.push(edge);
      });
    }
  }

  el('line', { class: 'skills-map-rail', x1: 40, x2: 960, y1: 395, y2: 395 });
  const toolLabel = el('text', { x: 40, y: 418, fill: '#6a7a9a', 'font-size': 12 });
  toolLabel.textContent = 'build & ship';

  tools.forEach(([name, desc], index) => {
    const x = 130 + index * 215;
    const node = el('g', { class: 'skills-map-node skills-map-tool', tabindex: '0', role: 'button', 'aria-label': `${name}: ${desc}` }, gNodes);
    el('rect', { x: x - W / 2 + 10, y: 440, width: W - 20, height: 40, rx: 20 }, node);
    const text = el('text', { x, y: 460 }, node);
    text.textContent = name;

    const tool = { node, tool: true, name, desc, out: [], inn: [] };
    node.addEventListener('mouseenter', () => focusSkill(tool));
    node.addEventListener('focus', () => focusSkill(tool));
    node.addEventListener('click', () => focusSkill(tool));
    node.addEventListener('mouseleave', releaseSkill);
    node.addEventListener('blur', releaseSkill);
    nodes.push(tool);
  });

  const clearMap = () => {
    nodes.forEach(skill => skill.node.classList.remove('is-on', 'is-hot', 'skills-map-dim'));
    edges.forEach(edge => edge.path.classList.remove('is-on', 'skills-map-dim'));
  };

  let held = false;
  const reach = (skill, dir, skillSet, edgeSet) => {
    skillSet.add(skill);
    skill[dir].forEach(edge => {
      edgeSet.add(edge);
      reach(dir === 'out' ? edge.b : edge.a, dir, skillSet, edgeSet);
    });
  };

  function focusSkill(skill) {
    held = true;
    clearMap();

    if (skill.tool) {
      nodes.forEach(item => {
        if (item !== skill) item.node.classList.add('skills-map-dim');
      });
      edges.forEach(edge => edge.path.classList.add('skills-map-dim'));
      skill.node.classList.add('is-hot');
      caption.innerHTML = `<b>${skill.name}</b> sits outside the request path: <i>${skill.desc}</i>.`;
      return;
    }

    const skillSet = new Set();
    const edgeSet = new Set();
    reach(skill, 'out', skillSet, edgeSet);
    reach(skill, 'inn', skillSet, edgeSet);

    nodes.forEach(item => item.node.classList.add(skillSet.has(item) ? 'is-on' : 'skills-map-dim'));
    edges.forEach(edge => edge.path.classList.add(edgeSet.has(edge) ? 'is-on' : 'skills-map-dim'));
    skill.node.classList.remove('is-on');
    skill.node.classList.add('is-hot');

    const upstream = new Set(nodes.filter(item => skillSet.has(item) && item.colIndex < skill.colIndex).map(item => item.name)).size;
    const downstream = new Set(nodes.filter(item => skillSet.has(item) && item.colIndex > skill.colIndex).map(item => item.name)).size;
    caption.innerHTML = `<b>${skill.name}</b> — <i>${skill.desc}</i>. Connected to ${upstream} skills upstream and ${downstream} downstream.`;
  }

  function releaseSkill() {
    held = false;
    clearMap();
    caption.innerHTML = 'Hover or tap a skill. Idle, the map traces a request end to end.';
  }

  releaseSkill();

  const packets = [];
  const spawnPacket = (edge, color = '#00f0ff') => {
    if (reduce) return;
    const len = edge.path.getTotalLength();
    const circle = el('circle', { r: 3.2, fill: color }, gPackets);
    circle.style.filter = `drop-shadow(0 0 4px ${color})`;
    packets.push({ edge, len, circle, distance: 0, velocity: len / (90 + Math.random() * 60) });
  };

  let last = performance.now();
  const loopPackets = now => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    for (let i = packets.length - 1; i >= 0; i--) {
      const packet = packets[i];
      packet.distance += packet.velocity * dt;

      if (packet.distance >= packet.len) {
        const nextEdges = packet.edge.b.out;
        if (nextEdges.length) {
          packet.edge = nextEdges[Math.floor(Math.random() * nextEdges.length)];
          packet.len = packet.edge.path.getTotalLength();
          packet.velocity = packet.len / (90 + Math.random() * 60);
          packet.distance = 0;
        } else {
          packet.circle.remove();
          packets.splice(i, 1);
          continue;
        }
      }

      const point = packet.edge.path.getPointAtLength(packet.distance);
      packet.circle.setAttribute('cx', point.x);
      packet.circle.setAttribute('cy', point.y);
    }

    requestAnimationFrame(loopPackets);
  };

  let tracing = false;
  const tracePath = () => {
    if (held || tracing) return;

    let skill = at(0, Math.floor(Math.random() * 3));
    const path = [skill];
    const pathEdges = [];

    while (skill.out.length) {
      const edge = skill.out[Math.floor(Math.random() * skill.out.length)];
      pathEdges.push(edge);
      skill = edge.b;
      path.push(skill);
    }

    tracing = true;
    clearMap();
    const skillSet = new Set(path);
    const edgeSet = new Set(pathEdges);
    nodes.forEach(item => item.node.classList.add(skillSet.has(item) ? 'is-on' : 'skills-map-dim'));
    edges.forEach(edge => edge.path.classList.add(edgeSet.has(edge) ? 'is-on' : 'skills-map-dim'));
    caption.innerHTML = `a request travels: <b>${path.map(item => item.name).join('</b> -> <b>')}</b>`;

    setTimeout(() => {
      tracing = false;
      if (!held) {
        clearMap();
        releaseSkill();
      }
    }, 3200);
  };

  if (!reduce) {
    setInterval(() => {
      if (packets.length < 14) {
        const edge = edges[Math.floor(Math.random() * 12)];
        spawnPacket(edge, Math.random() < 0.2 ? '#ff2d78' : '#00f0ff');
      }
    }, 350);
    requestAnimationFrame(loopPackets);
    setInterval(tracePath, 5200);
  }
})();

// ===== HERO BG TEXT PARALLAX =====
const heroBgText = document.querySelector('.hero-bg-text');
window.addEventListener('scroll', () => {
  if (!heroBgText) return;
  const scrolled = window.scrollY;
  heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.25}px))`;
  heroBgText.style.opacity   = Math.max(0, 1 - scrolled / 500);
});
