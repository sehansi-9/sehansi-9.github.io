let audioCtx = null;
let isSoundEnabled = localStorage.getItem('aero_sound') !== 'false';

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => { });
    }
}

function startBackgroundMusic() {
    if (!isSoundEnabled) return;

    const music = document.getElementById('aeroBackgroundMusic');
    if (!music) return;

    music.volume = 0.155;

    music.play().then(() => {
        removeMusicGestureListener();
    }).catch(() => {
        addMusicGestureListener();
    });
}

let musicGestureListenerAdded = false;

function musicGestureHandler() {
    if (!isSoundEnabled) return;

    const music = document.getElementById('aeroBackgroundMusic');
    if (!music) return;

    initAudio();

    music.play().then(() => {
        removeMusicGestureListener();
    }).catch(() => { });
}

function addMusicGestureListener() {
    if (musicGestureListenerAdded) return;

    musicGestureListenerAdded = true;

    document.addEventListener('pointerdown', musicGestureHandler, {
        once: true,
        passive: true
    });
}

function removeMusicGestureListener() {
    musicGestureListenerAdded = false;
    document.removeEventListener('pointerdown', musicGestureHandler);
}

function playAeroChime(type = 'chime') {
    if (!isSoundEnabled) return;

    try {
        if (type === 'music') {
            startBackgroundMusic();
            return;
        }

        if (type === 'musicStop') {
            const music = document.getElementById('aeroBackgroundMusic');

            if (music) {
                music.pause();
                music.currentTime = 0;
            }

            return;
        }

        initAudio();

        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'pop') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
            osc.frequency.exponentialRampToValueAtTime(
                1400 + Math.random() * 400,
                now + 0.08
            );
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.13);

        } else if (type === 'click') {
            const clickSound = new Audio(
                'https://sfxmint.com/dl/office-mouse-click-01.wav'
            );

            clickSound.volume = 0.35;
            clickSound.play().catch(() => { });

            return;

        } else {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.04);
            osc.frequency.setValueAtTime(783.99, now + 0.08);
            osc.frequency.setValueAtTime(1046.50, now + 0.12);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            osc.start(now);
            osc.stop(now + 0.48);
        }

    } catch (err) {
        console.warn("Aero sound error:", err);
    }
}

function toggleAeroAudio() {
    isSoundEnabled = !isSoundEnabled;

    localStorage.setItem(
        'aero_sound',
        isSoundEnabled ? 'true' : 'false'
    );

    const onIcon = document.getElementById('soundIconOn');
    const offIcon = document.getElementById('soundIconOff');

    if (onIcon && offIcon) {
        onIcon.style.display = isSoundEnabled ? 'block' : 'none';
        offIcon.style.display = isSoundEnabled ? 'none' : 'block';
    }

    const onIconMob = document.getElementById('soundIconOnMob');
    const offIconMob = document.getElementById('soundIconOffMob');

    if (onIconMob && offIconMob) {
        onIconMob.style.display = isSoundEnabled ? 'block' : 'none';
        offIconMob.style.display = isSoundEnabled ? 'none' : 'block';
    }

    const music = document.getElementById('aeroBackgroundMusic');

    if (isSoundEnabled) {
        startBackgroundMusic();
        playAeroChime('chime');
    } else {
        removeMusicGestureListener();

        if (music) {
            music.pause();
            music.currentTime = 0;
        }
    }
}

window.addEventListener('load', () => {
    if (isSoundEnabled) {
        startBackgroundMusic();
    }
});

function toggleAeroTheme() {
    const isDark =
        document.documentElement.getAttribute('data-theme') === 'dark';

    const nextTheme = isDark ? 'light' : 'dark';

    if (nextTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem('theme', nextTheme);

    const sunIcon = document.getElementById('themeIconSun');
    const moonIcon = document.getElementById('themeIconMoon');

    const sunIconMob = document.getElementById('themeIconSunMob');
    const moonIconMob = document.getElementById('themeIconMoonMob');

    if (nextTheme === 'dark') {

        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';

        if (sunIconMob) sunIconMob.style.display = 'block';
        if (moonIconMob) moonIconMob.style.display = 'none';

    } else {

        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';

        if (sunIconMob) sunIconMob.style.display = 'none';
        if (moonIconMob) moonIconMob.style.display = 'block';

    }
    updateDuolingoTheme();

    playAeroChime('chime');

}

const TAB_TITLES = {
    home: 'Home',
    about: 'About Me',
    projects: 'Projects',
    events: 'Events & Community',
    writing: 'Writing',
    fun: 'Weather & Fun',
};

let activeTabId = 'home';

const MOBILE_TAB_LABELS = {
    home: '🏠 Home',
    about: '👤 About',
    projects: '📁 Projects',
    events: '📅 Events',
    writing: '✍️ Writing',
    fun: '🌤️ Weather & Fun',
};

function toggleMobileDrawer() {
    const drawer = document.getElementById('mobileNavDrawer');
    const toggle = document.getElementById('mobileNavToggle');
    if (!drawer) return;
    const isOpen = drawer.classList.toggle('open');
    if (toggle) {
        toggle.style.transform = isOpen ? 'rotate(180deg)' : '';
    }
}

function closeMobileDrawer() {
    const drawer = document.getElementById('mobileNavDrawer');
    const toggle = document.getElementById('mobileNavToggle');
    if (drawer) drawer.classList.remove('open');
    if (toggle) toggle.style.transform = '';
}

function switchAeroTab(tabId, event, updateHash = true) {
    if (event && event.preventDefault) event.preventDefault();
    activeTabId = tabId;
    playAeroChime('click');

    closeMobileDrawer();

    if (updateHash) {
        if (window.location.hash !== '#' + tabId) {
            window.location.hash = '#' + tabId;
        }
    }

    if (tabId !== 'projects') {
        const overview = document.getElementById('projects-overview-view');
        const detail = document.getElementById('projects-detail-view');
        if (overview && detail) {
            detail.style.display = 'none';
            overview.style.display = 'flex';
        }
    }

    document.querySelectorAll('.aero-tab-btn').forEach(btn => {
        const isSelected = btn.getAttribute('data-tab') === tabId;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    const mobileLabel = document.getElementById('mobileNavActiveLabel');
    if (mobileLabel) mobileLabel.textContent = MOBILE_TAB_LABELS[tabId] || tabId;
    document.querySelectorAll('.mobile-drawer-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-mob-tab') === tabId);
    });

    const titleEl = document.getElementById('activeWindowTitle');
    if (titleEl) {
        titleEl.textContent = TAB_TITLES[tabId] || 'Home';
    }

    document.querySelectorAll('.aero-tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });

    const canvas = document.getElementById('windowContentCanvas');
    if (canvas) canvas.scrollTop = 0;
}


let currentProjectFilter = 'all';

function filterAeroProjects(cat) {
    currentProjectFilter = cat;
    playAeroChime('click');
    document.querySelectorAll('.tab-filter-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-cat') === cat);
    });
    renderAeroProjects();
}

function renderAeroProjects() {
    const gridContainer = document.getElementById('aero-projects-grid') || document.getElementById('aero-projects-list');
    if (!gridContainer || typeof PROJECTS === 'undefined') return;

    const filtered = PROJECTS.map((p, originalIndex) => ({ ...p, originalIndex }))
        .filter(p => currentProjectFilter === 'all' || p.category === currentProjectFilter);

    gridContainer.innerHTML = filtered.map(p => {
        const sdgs = p.detail && p.detail.sdgs ? p.detail.sdgs : [];
        return `
    <div class="aero-proj-card" onclick="openAeroProjectDetail(${p.originalIndex})">
      <div class="proj-card-top">
        <div class="proj-card-icon-badge" style="background: ${p.color || '#0284c7'};">
          ${getProjectIcon(p.icon)}
        </div>
        ${p.date ? `<div class="proj-card-date">${p.date}</div>` : ''}
      </div>
      <div class="proj-card-body">
        <div class="proj-card-title">${p.title}</div>
        ${p.org ? `<div class="proj-card-org">${p.org}</div>` : ''}
        <div class="proj-card-desc">${p.desc}</div>
        ${sdgs.length > 0 ? `
          <div class="proj-sdg-strip">
            ${sdgs.map(s => `
              <div class="proj-sdg-badge" title="${s.title}">
                ${s.img ? `<img src="${s.img}" alt="${s.title}" loading="lazy" onerror="this.parentElement.innerHTML='<span style=\\'font-size:10px;font-weight:900;color:#fff;\\'>${s.id}</span>'">` : `<span style="font-size:10px;font-weight:900;color:#fff;">${s.id}</span>`}
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div class="row-tags">
          ${(p.tags || []).slice(0, 3).map(t => `<span class="row-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="proj-card-bottom">
        <div class="proj-card-action">
      ${p.detail
                ? `<span>Case study ➔</span>`
                : `<span> </span>`}
    </div>
      </div>
    </div>
  `;
    }).join('');
}

function getProjectIcon(icon) {
    switch (icon) {
        case 'bot': return '🤖';
        case 'globe': return '🌐';
        case 'heart': return '❤️';
        case 'cpu': return '⚡';
        case 'cat': return '🐱';
        default: return '📁';
    }
}

function renderAeroCertifications() {
    const container = document.getElementById('aero-certs-container');
    if (!container || typeof CERTIFICATIONS === 'undefined') return;

    container.innerHTML = CERTIFICATIONS.map(c => `
    <a class="aero-pill-row" href="${c.url}" target="_blank" rel="noopener">
      <div class="row-info-col">
        <div class="row-title">${c.title}</div>
        <div class="row-desc">${c.issuer} · ${c.date}</div>
        ${c.badge ? `<div class="row-tags"><span class="row-tag">${c.badge}</span></div>` : ''}
      </div>
      <div class="row-action-arrow">↗</div>
    </a>
  `).join('');
}

function renderAeroEvents() {
    const gridContainer = document.getElementById('aero-events-grid') || document.getElementById('aero-events-list');
    if (!gridContainer || typeof EVENTS === 'undefined') return;

    gridContainer.innerHTML = EVENTS.map((e, idx) => `
    <div class="aero-event-card" onclick="openAeroLightbox('${e.src}', '${e.title.replace(/'/g, "\\'")}')">
      <div class="event-img-wrap">
        <img src="${e.src}" alt="${e.title}" class="event-img" loading="lazy">
        <div class="event-overlay-badge">Enlarge 🔍</div>
      </div>
      <div class="event-card-body">
        <div class="event-card-title">${e.title}</div>
        <div class="event-card-desc">${e.desc}</div>
      </div>
    </div>
  `).join('');
}
let currentAboutFilter = 'experience';

function filterAeroAbout(cat) {
    currentAboutFilter = cat;
    playAeroChime('click');
    document.querySelectorAll('[data-about]').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-about') === cat);
    });

    const expSec = document.getElementById('about-section-experience');
    const eduSec = document.getElementById('about-section-education');
    const certSec = document.getElementById('about-section-certs');

    if (expSec) expSec.style.display = (cat === 'experience') ? 'flex' : 'none';
    if (eduSec) eduSec.style.display = (cat === 'education') ? 'flex' : 'none';
    if (certSec) certSec.style.display = (cat === 'certs') ? 'flex' : 'none';
}

let currentWritingFilter = 'all';

function filterAeroWriting(cat) {
    currentWritingFilter = cat;
    playAeroChime('click');
    document.querySelectorAll('[data-writing]').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-writing') === cat);
    });
    renderAeroWriting();
}

function getBlogTimestamp(b) {
    return new Date(b.date).getTime();
}

function renderAeroWriting() {
    const container = document.getElementById('aero-writing-list');

    if (!container || typeof BLOG === 'undefined') return;

    let list = [];

    if (currentWritingFilter === 'all') {
        list = [
            ...(BLOG.tech || []),
            ...(BLOG.life || [])
        ];
        list.sort((a, b) => getBlogTimestamp(b) - getBlogTimestamp(a));
    } else if (currentWritingFilter === 'tech') {
        list = BLOG.tech || [];
    } else if (currentWritingFilter === 'life') {
        list = BLOG.life || [];
    }

    container.innerHTML = list.map(b => `
<a class="aero-pill-row" href="${b.url}" target="_blank" rel="noopener">
<div class="row-thumb-wrap">
<img src="${b.img}" alt="${b.title}" class="row-thumb-img" loading="lazy" onerror="this.src='favicon.svg'" >
</div>
<div class="row-info-col">
  <div class="row-title">${b.title}</div>
  <div class="row-desc">${b.desc}</div>
  <div class="row-tags">
    <span class="row-tag">${b.meta}</span>
  </div>
</div>
<div class="row-action-arrow">↗</div>
</a>
`).join('');
}

function openAeroProjectDetail(idx, updateHash = true) {
    const p = PROJECTS[idx];
    if (!p) return;

    const d = p.detail;
    if (!d) {
        if (p.links && p.links.length > 0) window.open(p.links[0].url, '_blank');
        return;
    }

    if (updateHash) {
        window.location.hash = '#project-' + idx;
    }
    switchAeroTab('projects', null, false);

    const overview = document.getElementById('projects-overview-view');
    const detail = document.getElementById('projects-detail-view');
    if (!overview || !detail) return;

    overview.style.display = 'none';
    detail.style.display = 'flex';

    detail.innerHTML = `
    <div class="cs-header-wrap">
      <button class="sidebar-pill-btn cs-back-btn" onclick="backToProjectsList()" style="width: auto; padding: 7px 18px; margin: 0; cursor: pointer;">
        <span>← Back to Projects</span>
      </button>
      <div class="cs-tag-badge">
        Case Study View
      </div>
    </div>

    <div class="cs-meta">${p.org || ''} · ${p.date || ''}</div>
    <h2 class="cs-title">${p.title}</h2>
    
    ${(d.snapshots && d.snapshots.length) ? `
      <div class="pm-gallery-strip" style="margin-bottom:20px;">
        ${d.snapshots.map(s => s.type === 'embed' ? `
          <div class="pm-gallery-card pm-gallery-card--video" onclick="openAeroLightboxVideo('${s.src}', '${p.title.replace(/'/g, "\\'")}', '${(s.alt || '').replace(/'/g, "\\'")}')">
            <div class="pm-gallery-video-wrap">
              <iframe
                src="${s.src}"
                allow="autoplay; fullscreen"
                allowfullscreen
                loading="lazy"
                title="${s.alt || p.title}"
                frameborder="0"
              ></iframe>
              <div class="pm-gallery-click-cover"></div>
              <div class="pm-gallery-overlay-badge">Enlarge 🔍</div>
            </div>
            ${s.alt ? `<div class="pm-gallery-video-label">${s.alt}</div>` : ''}
          </div>
        ` : `
          <div class="pm-gallery-card" onclick="openAeroLightbox('${s.src}', '${p.title.replace(/'/g, "\\'")}', '${(s.alt || '').replace(/'/g, "\\'")}')">
            <div class="pm-gallery-img-wrap">
              <img src="${s.src}" alt="${s.alt || p.title}" loading="lazy">
              <div class="pm-gallery-overlay-badge">Enlarge 🔍</div>
            </div>
            ${s.alt ? `<div class="pm-gallery-video-label">${s.alt}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    <div class="cs-section">
      <h4 class="cs-section-title">The Problem</h4>
      <p class="cs-body-text">${d.problem}</p>
    </div>

    <div class="cs-section">
      <h4 class="cs-section-title">Approach</h4>
      <div class="cs-approach-grid">
        ${d.approach.map(a => `
          <div class="cs-approach-card">
            <div class="cs-approach-title">${a.heading}</div>
            <div class="cs-approach-body">${a.body}</div>
          </div>
        `).join('')}
      </div>
    </div>

    ${(d.highlights && d.highlights.length) ? `
      <div class="cs-section">
        <h4 class="cs-section-title">Key Highlights</h4>
        <ul class="cs-highlights-list">
          ${d.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    ${(d.sdgs && d.sdgs.length) ? `
      <div class="cs-section">
        <h4 class="cs-section-title">Sustainable Development Goals (SDGs)</h4>
        <div class="cs-sdg-grid">
          ${d.sdgs.map(s => `
            <div class="cs-sdg-card">
              <div class="cs-sdg-thumb">
                ${s.img ? `<img src="${s.img}" alt="${s.title}" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:#fff;font-weight:800;\\'>${s.id}</div>'">` : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#fff; font-weight:800;">${s.id}</div>`}
              </div>
              <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
                <div class="cs-sdg-title">${s.title}</div>
                ${s.desc ? `<div class="cs-sdg-desc">${s.desc}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${(d.stack && Object.keys(d.stack).length) ? `
      <div class="cs-section">
        <h4 class="cs-section-title">Tech Stack</h4>
        <div class="cs-stack-grid">
          ${Object.entries(d.stack).map(([key, items]) => `
            <div class="cs-stack-box">
              <div class="cs-stack-label">${key}</div>
              <div style="display:flex; flex-wrap:wrap; gap:5px;">
                ${(items || []).map(t => `<span class="row-tag" style="font-size:11px; padding:2px 8px;">${t}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div class="cs-links-wrap">
      ${(p.links || []).map(l => `
        <a href="${l.url}" target="_blank" rel="noopener" class="sidebar-pill-btn" style="width:auto; padding:8px 18px;">${l.label}</a>
      `).join('')}
    </div>
  `;

    const canvas = document.getElementById('windowContentCanvas');
    if (canvas) canvas.scrollTop = 0;
}

function backToProjectsList(updateHash = true) {
    playAeroChime('click');
    if (updateHash) {
        window.location.hash = '#projects';
    }
    const overview = document.getElementById('projects-overview-view');
    const detail = document.getElementById('projects-detail-view');
    if (overview && detail) {
        detail.style.display = 'none';
        overview.style.display = 'flex';
    }
    const canvas = document.getElementById('windowContentCanvas');
    if (canvas) canvas.scrollTop = 0;
}

function openAeroLightbox(src, title, altText, isVideo = false) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const videoWrap = document.getElementById('lightboxVideoWrap');
    const iframe = document.getElementById('lightboxIframe');
    const cap = document.getElementById('lightboxCaption');
    if (!modal) return;

    if (isVideo) {
        if (img) {
            img.style.display = 'none';
            img.src = '';
        }
        if (videoWrap && iframe) {
            videoWrap.style.display = 'block';
            iframe.src = src;
        }
    } else {
        if (videoWrap && iframe) {
            videoWrap.style.display = 'none';
            iframe.src = '';
        }
        if (img) {
            img.style.display = 'block';
            img.src = src;
        }
    }

    if (cap) {
        cap.innerHTML = (altText && altText.trim())
            ? `<span class="lb-project">${title}</span><span class="lb-sep">·</span><span class="lb-alt">${altText}</span>`
            : `<span class="lb-project">${title}</span>`;
    }

    modal.classList.add('active');
    playAeroChime('chime');
}

function openAeroLightboxVideo(src, title, altText) {
    openAeroLightbox(src, title, altText, true);
}

function closeLightbox(e) {
    if (!e || e.target.id === 'lightboxModal' || e.target.classList.contains('lightbox-close')) {
        const modal = document.getElementById('lightboxModal');
        if (modal) modal.classList.remove('active');
        const iframe = document.getElementById('lightboxIframe');
        if (iframe) iframe.src = '';
    }
}

function initAeroBubbles() {
    const container = document.getElementById('aeroBubblesContainer');
    if (!container) return;

    const count = window.innerWidth <= 768 ? 6 : 12;

    function createBubble(i, isInitial = true) {
        const b = document.createElement('div');
        b.className = 'aero-bubble';
        const size = 18 + Math.random() * 36;
        const left = Math.random() * 96;
        const duration = 12 + Math.random() * 10;
        const delay = isInitial ? -(Math.random() * duration) : Math.random() * 2;

        b.style.width = size + 'px';
        b.style.height = size + 'px';
        b.style.left = left + '%';
        b.style.animation = `floatBubble ${duration}s infinite ease-in-out`;
        b.style.animationDelay = delay + 's';

        b.addEventListener('click', (e) => {
            e.stopPropagation();
            playAeroChime('pop');
            b.style.transform = 'scale(1.8)';
            b.style.opacity = '0';
            setTimeout(() => {
                b.remove();
                createBubble(i, false);
            }, 200);
        });

        container.appendChild(b);
    }

    for (let i = 0; i < count; i++) {
        createBubble(i, true);
    }
}

function spawnBubbleBurst() {
    playAeroChime('chime');
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const container = document.getElementById('aero-desktop');
            if (!container) return;
            const b = document.createElement('div');
            b.className = 'aero-bubble';
            const size = 20 + Math.random() * 30;
            b.style.width = size + 'px';
            b.style.height = size + 'px';
            b.style.left = (15 + Math.random() * 70) + '%';
            b.style.animation = `floatBubble ${8 + Math.random() * 6}s ease-in-out`;
            b.addEventListener('click', (e) => {
                e.stopPropagation();
                playAeroChime('pop');
                b.style.transform = 'scale(1.8)';
                b.style.opacity = '0';
                setTimeout(() => {
                    b.remove();
                    createBubble(i, false);
                }, 200);
            });
            container.appendChild(b);
            setTimeout(() => b.remove(), 14000);
        }, i * 80);
    }
}
function handleHashRouting() {
    const hash = window.location.hash ? window.location.hash.replace('#', '').trim() : '';
    if (!hash) {
        switchAeroTab('home', null, false);
        return;
    }

    if (hash.startsWith('project-')) {
        const projIdx = parseInt(hash.replace('project-', ''), 10);
        if (!isNaN(projIdx) && typeof PROJECTS !== 'undefined' && PROJECTS[projIdx]) {
            openAeroProjectDetail(projIdx, false);
            return;
        }
    }

    if (TAB_TITLES[hash]) {
        switchAeroTab(hash, null, false);
    } else {
        switchAeroTab('home', null, false);
    }
}

async function loadWeather() {
    const latitude = 6.9271;
    const longitude = 79.8612;

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day` +
        `&temperature_unit=celsius` +
        `&wind_speed_unit=kmh` +
        `&timezone=Asia%2FColombo`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Weather API request failed");
        }

        const data = await response.json();
        const weather = data.current;

        const temperature = Math.round(weather.temperature_2m);
        const humidity = Math.round(weather.relative_humidity_2m);
        const wind = Math.round(weather.wind_speed_10m);
        const weatherCode = weather.weather_code;
        const isDay = weather.is_day === 1;

        const weatherInfo = getWeatherInfo(weatherCode, isDay);

        document.getElementById("weatherMain").textContent =
            `${temperature}°C · ${weatherInfo.description}`;

        document.getElementById("weatherDetails").textContent =
            `Humidity: ${humidity}% · Wind: ${wind} km/h`;

        document.getElementById("weatherAtmosphere").textContent =
            `Atmosphere: ${weatherInfo.atmosphere}`;

        const weatherImage = document.getElementById("weatherImage");
        const weatherEmoji = document.getElementById("weatherEmoji");

        if (weatherInfo.image) {

            weatherImage.onload = function () {
                weatherImage.style.display = "block";
                weatherEmoji.style.display = "none";
            };

            weatherImage.onerror = function () {
                weatherImage.style.display = "none";
                weatherEmoji.style.display = "flex";
                weatherEmoji.textContent = weatherInfo.emoji;
            };

            weatherImage.src = weatherInfo.image;
            weatherImage.alt = weatherInfo.description;

        } else {
            weatherImage.style.display = "none";
            weatherEmoji.style.display = "flex";
            weatherEmoji.textContent = weatherInfo.emoji;
        }

    } catch (error) {

        console.error("Weather error:", error);
        document.getElementById("weatherMain").textContent =
            "Weather unavailable";

        document.getElementById("weatherDetails").textContent =
            "Unable to retrieve current conditions";

        document.getElementById("weatherAtmosphere").textContent =
            "Atmosphere: Offline";

        const weatherImage = document.getElementById("weatherImage");
        weatherImage.style.display = "none";

        const weatherEmoji = document.getElementById("weatherEmoji");
        weatherEmoji.style.display = "flex";
        weatherEmoji.textContent = "⛅";
    }
}


function getWeatherInfo(code, isDay) {

    if (code === 0) {
        return {
            description: isDay ? "Clear Sky ☀️" : "Clear Night 🌙",
            atmosphere: "Pure Bliss",
            emoji: isDay ? "☀️" : "🌙",
            image: isDay
                ? "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=500&q=80"
                : "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code === 1 || code === 2) {
        return {
            description: "Partly Cloudy ⛅",
            atmosphere: "Soft & Breezy",
            emoji: "⛅",
            image:
                "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code === 3) {
        return {
            description: "Overcast ☁️",
            atmosphere: "Calm & Dreamy",
            emoji: "☁️",
            image:
                "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code >= 45 && code <= 48) {
        return {
            description: "Misty 🌫️",
            atmosphere: "Soft & Quiet",
            emoji: "🌫️",
            image:
                "https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code >= 51 && code <= 57) {
        return {
            description: "Light Drizzle 🌦️",
            atmosphere: "Fresh & Refreshing",
            emoji: "🌦️",
            image:
                "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code >= 61 && code <= 67) {
        return {
            description: "Rainy 🌧️",
            atmosphere: "Fresh & Tropical",
            emoji: "🌧️",
            image:
                "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            description: "Rain Showers 🌦️",
            atmosphere: "Tropical & Fresh",
            emoji: "🌦️",
            image:
                "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=500&q=80"
        };
    }

    if (code >= 95) {
        return {
            description: "Thunderstorm ⛈️",
            atmosphere: "Electric Skies",
            emoji: "⛈️",
            image:
                "https://images.unsplash.com/photo-1605727216801-e27ce1d0a907?auto=format&fit=crop&w=500&q=80"
        };
    }

    return {
        description: "Tropical Weather 🌤️",
        atmosphere: "Pure Bliss",
        emoji: "🌤️",
        image: null
    };
}

const duolingoStats = document.getElementById('duolingoStats');

function updateDuolingoTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        duolingoStats.src =
            'https://duolingo-stats-card.vercel.app/api?username=Sehansi.P&theme=tokyonight';
    } else {
        duolingoStats.src =
            'https://duolingo-stats-card.vercel.app/api?username=Sehansi.P&theme=light';
    }
}

updateDuolingoTheme();

const clockFace = document.getElementById('clockFace');
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');
const digitalTime = document.getElementById('digitalTime');

for (let i = 0; i < 60; i++) {
    const tick = document.createElement('div');
    tick.className = 'clock-tick' + (i % 5 === 0 ? ' major' : '');
    tick.style.transform = `translate(-50%, 0) rotate(${i * 6}deg)`;
    clockFace.appendChild(tick);
}
for (let n = 1; n <= 12; n++) {
    const num = document.createElement('div');
    num.className = 'clock-number';
    num.textContent = n;
    const angle = (n * 30 - 90) * (Math.PI / 180);
    const r = 38;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    num.style.left = x + '%';
    num.style.top = y + '%';
    num.style.transform = 'translate(-50%, -50%)';
    clockFace.appendChild(num);
}

function updateClock() {
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();

    const hourDeg = (h + m / 60) * 30;
    const minDeg = (m + s / 60) * 6;
    const secDeg = s * 6;

    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minDeg}deg)`;
    secondHand.style.transform = `rotate(${secDeg}deg)`;

    digitalTime.textContent = now.toLocaleTimeString([], { hour12: false });
}
updateClock();
setInterval(updateClock, 1000);

loadWeather();
setInterval(loadWeather, 15 * 60 * 1000);

document.addEventListener('DOMContentLoaded', () => {
    renderAeroProjects();
    renderAeroCertifications();
    renderAeroEvents();
    renderAeroWriting();
    filterAeroAbout('experience');
    filterAeroWriting('all');
    initAeroBubbles();
    handleHashRouting();
});

window.addEventListener('hashchange', () => {
    handleHashRouting();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        closeProjectModal();
    }
});