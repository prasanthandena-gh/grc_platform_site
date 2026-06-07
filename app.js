/* ===========================================================
   Verity landing — interactions
   =========================================================== */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const saved = localStorage.getItem('verity-theme');
  if (saved) root.setAttribute('data-theme', saved);
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('verity-theme', next);
    });
  }

  /* ---------- nav shadow on scroll + progress bar ---------- */
  const nav = document.getElementById('nav');
  const bar = document.querySelector('.scroll-progress span');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
    if (bar) {
      const h = document.documentElement;
      const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = pct + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- spotlight follow ---------- */
  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    const sp = document.querySelector('.spotlight');
    let raf = null;
    window.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        sp.style.setProperty('--mx', e.clientX + 'px');
        sp.style.setProperty('--my', e.clientY + 'px');
        raf = null;
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---------- animated counters ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1100; const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-count]').forEach((el) => cio.observe(el));

  /* ---------- marquee (evidence sources) ---------- */
  const checkIco = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const sources = ['AWS', 'GitHub', 'Okta', 'Confluence', 'Jira', 'ServiceNow', 'IAM policies', 'Policy docs', 'CloudTrail', 'TLS configs'];
  const track = document.getElementById('marqueeTrack');
  if (track) {
    const html = sources.map((s) => `<span class="item">${checkIco}${s}</span>`).join('');
    track.innerHTML = html + html; // duplicate for seamless loop
  }

  /* ===========================================================
     Product showcase — tabs + lightbox over real screenshots
     =========================================================== */
  (() => {
    const tabs = Array.from(document.querySelectorAll('.shot-tab'));
    const img = document.getElementById('shotImg');
    const path = document.getElementById('framePath');
    const cap = document.getElementById('shotCaption');
    const zoom = document.getElementById('frameZoom');
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbClose = document.getElementById('lightboxClose');
    if (!tabs.length || !img) return;

    // preload all shots so switching is instant
    tabs.forEach((t) => { const p = new Image(); p.src = t.dataset.src; });

    let active = 0;
    let timer = null;

    const select = (i, userInitiated) => {
      active = i;
      const t = tabs[i];
      img.src = t.dataset.src;
      img.alt = t.dataset.title;
      if (path) path.textContent = t.dataset.path;
      if (cap) cap.innerHTML = `<h3>${t.dataset.title}</h3><p>${t.dataset.desc}</p>`;
      tabs.forEach((x, n) => {
        x.classList.toggle('active', n === i);
        x.setAttribute('aria-selected', n === i ? 'true' : 'false');
      });
      if (userInitiated) stopAuto();
    };

    const stopAuto = () => { if (timer) { clearInterval(timer); timer = null; } };
    const startAuto = () => {
      if (reduceMotion) return;
      stopAuto();
      timer = setInterval(() => select((active + 1) % tabs.length, false), 5000);
    };

    tabs.forEach((t, i) => t.addEventListener('click', () => select(i, true)));

    // lightbox
    const openLb = () => {
      lbImg.src = img.src; lbImg.alt = img.alt;
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
      stopAuto();
    };
    const closeLb = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); };
    img.addEventListener('click', openLb);
    if (zoom) zoom.addEventListener('click', openLb);
    if (lbClose) lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

    // auto-advance only while the showcase is on screen
    const showObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.isIntersecting ? startAuto() : stopAuto());
    }, { threshold: 0.25 });
    const showcase = document.querySelector('.showcase');
    if (showcase) showObs.observe(showcase);
  })();

  /* ===========================================================
     Live reasoning console — the signature element.
     Streams a real SOC 2 CC6.1 (MFA) control test.
     =========================================================== */
  const body = document.getElementById('consoleBody');
  if (!body) return;

  const script = [
    { tag: 'plan',    txt: 'Testing <b>CC6.1</b> — multi-factor authentication on production access.' },
    { tag: 'plan',    txt: 'Reading methodology <span class="q">soc2-cc6.1.md</span> · v3 …' },
    { tag: 'tool',    txt: 'aws.iam.list_users() → <b>47 users</b> returned' },
    { tag: 'tool',    txt: 'aws.iam.get_mfa_devices() → enumerating factors …' },
    { tag: 'check',   txt: 'deterministic count → <b>3 users</b> with no second factor' },
    { tag: 'tool',    txt: 'docs.search("multi-factor") → access-control-policy.pdf p.4' },
    { tag: 'check',   txt: 'citation grounding → quote string-matched <b>✓</b>' },
    { tag: 'llm',     txt: 'drafting verdict with cited evidence …' },
    { tag: 'verdict', final: true },
  ];

  const TAG_LABEL = { plan: 'PLAN', tool: 'TOOL', check: 'CHECK', llm: 'LLM', verdict: 'VERDICT' };

  function makeLine(step) {
    const line = document.createElement('div');
    line.className = 'line';
    const tag = document.createElement('span');
    tag.className = 'tag ' + step.tag;
    tag.textContent = TAG_LABEL[step.tag];
    const txt = document.createElement('span');
    txt.className = 'txt';
    line.appendChild(tag);
    line.appendChild(txt);
    return { line, txt };
  }

  function finalVerdict() {
    const wrap = document.createElement('div');
    wrap.className = 'line';
    wrap.innerHTML =
      '<span class="tag verdict">VERDICT</span>' +
      '<span class="txt"><div class="verdict-final">' +
      '<span class="badge">DEFICIENT</span>' +
      '<span class="desc">3 of 47 production users lack MFA — policy violated.</span>' +
      '</div></span>';
    return wrap;
  }

  // typewriter that respects inline HTML (types visible text, keeps tags intact)
  function typeHTML(el, html, speed, done) {
    if (reduceMotion) { el.innerHTML = html; done && done(); return; }
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const full = tmp.textContent;       // plain length to pace by
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    el.parentNode.appendChild(cursor);
    const timer = setInterval(() => {
      i++;
      // reveal progressively by slicing the rendered html proportionally is hard;
      // simplest faithful approach: reveal plain text first, then swap to rich html at end
      el.textContent = full.slice(0, i);
      if (i >= full.length) {
        clearInterval(timer);
        el.innerHTML = html;            // restore rich formatting
        cursor.remove();
        done && done();
      }
    }, speed);
  }

  let idx = 0;
  function run() {
    if (idx >= script.length) {
      // pause, then restart the stream for ambient life
      setTimeout(() => {
        body.innerHTML = '';
        idx = 0;
        run();
      }, 4200);
      return;
    }
    const step = script[idx];

    if (step.final) {
      const el = finalVerdict();
      body.appendChild(el);
      requestAnimationFrame(() => el.classList.add('show'));
      idx++;
      run();
      return;
    }

    const { line, txt } = makeLine(step);
    body.appendChild(line);
    requestAnimationFrame(() => line.classList.add('show'));

    typeHTML(txt, step.txt, 16, () => {
      idx++;
      // keep the console scrolled to the newest line
      body.scrollTop = body.scrollHeight;
      setTimeout(run, 360);
    });
  }

  // kick off when the console scrolls into view
  const startObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { run(); startObs.disconnect(); }
    });
  }, { threshold: 0.3 });
  startObs.observe(body);
})();
