let currentProjectFilter = 'all';
let currentAboutFilter = 'experience';
let currentWritingFilter = 'all';

function filterAeroProjects(cat) {
  currentProjectFilter = cat;
  if (typeof playAeroChime === 'function') playAeroChime('click');
  document.querySelectorAll('.tab-filter-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-cat') === cat);
  });
  renderAeroProjects();
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
          ${p.detail ? `<span>Case study ➔</span>` : `<span> </span>`}
        </div>
      </div>
    </div>
  `;
  }).join('');
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

function filterAeroAbout(cat) {
  currentAboutFilter = cat;
  if (typeof playAeroChime === 'function') playAeroChime('click');
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

function filterAeroWriting(cat) {
  currentWritingFilter = cat;
  if (typeof playAeroChime === 'function') playAeroChime('click');
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
        <img src="${b.img}" alt="${b.title}" class="row-thumb-img" loading="lazy" onerror="this.src='assets/images/favicon.svg'">
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
  if (typeof switchAeroTab === 'function') {
    switchAeroTab('projects', null, false);
  }

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
  if (typeof playAeroChime === 'function') playAeroChime('click');
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
  if (typeof playAeroChime === 'function') playAeroChime('chime');
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

function closeProjectModal(e) {
  if (!e || e.target.id === 'projectModal' || e.target.classList.contains('proj-modal-close')) {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('active');
  }
}

/* ==========================================================================
   Aero Media Vault Renderer (WATCHED Showcase)
   ========================================================================== */
let currentWatchedFilter = 'all';
let currentWatchedSearch = '';

function getWatchedCategories() {
  return [
    { id: 'all', label: 'All Media', icon: '🎬' },
    { id: 'scifi', label: 'Sci-Fi', icon: '🚀' },
    { id: 'psychological', label: 'Psychological', icon: '🧠' },
    { id: 'tech', label: 'tech', icon: '💻' },
    { id: 'science', label: 'Science', icon: '🧪' },
    { id: 'mystery', label: 'Mystery', icon: '🔍' },
    { id: 'sliceOfLife', label: 'Slice of Life', icon: '🌱' },
    { id: 'music', label: 'Music & Live', icon: '🎵' },
  ];
}

function filterAeroWatched(cat) {
  currentWatchedFilter = cat;
  if (typeof playAeroChime === 'function') playAeroChime('click');
  document.querySelectorAll('[data-watched]').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-watched') === cat);
  });
  renderAeroWatched();
}

function searchAeroWatched(query) {
  currentWatchedSearch = (query || '').toLowerCase().trim();
  renderAeroWatched();
}

function renderAeroWatchedFilterBar() {
  const bar = document.getElementById('watchedFilterBar');
  if (!bar || typeof WATCHED === 'undefined') return;

  const cats = getWatchedCategories();
  const counts = { all: 0 };

  Object.keys(WATCHED).forEach(catKey => {
    const count = (WATCHED[catKey] || []).length;
    counts[catKey] = count;
    counts.all += count;
  });

  bar.innerHTML = cats.map(c => {
    const count = counts[c.id] || 0;
    const isActive = currentWatchedFilter === c.id;
    return `
            <button class="genre-list-btn ${isActive ? 'active' : ''}" data-watched="${c.id}" onclick="filterAeroWatched('${c.id}')">
                <span class="genre-btn-left">
                    <span class="genre-icon">${c.icon}</span>
                    <span class="genre-label">${c.label}</span>
                </span>
                <span class="genre-count">${count}</span>
            </button>
        `;
  }).join('');
}

function renderAeroWatched() {
  const grid = document.getElementById('aero-watched-grid');
  const badge = document.getElementById('watchedCountBadge');
  if (!grid || typeof WATCHED === 'undefined') return;

  renderAeroWatchedFilterBar();

  let allItems = [];
  Object.keys(WATCHED).forEach(catKey => {
    const items = WATCHED[catKey] || [];
    items.forEach(item => {
      allItems.push({
        ...item,
        catKey: catKey
      });
    });
  });

  const filtered = allItems.filter(item => {
    return currentWatchedFilter === 'all' || item.catKey === currentWatchedFilter;
  });

  if (badge) {
    badge.textContent = `${filtered.length} Title${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
            <div class="watched-empty-state">
                <div class="empty-icon">🛸</div>
                <div class="empty-title">No matching titles found</div>
                <div class="empty-desc">Try choosing another category.</div>
            </div>
        `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const safeTitle = (item.title || '').replace(/'/g, "\\'");
    const safeCategory = (item.category || '').replace(/'/g, "\\'");
    return `
            <div class="aero-poster-card" onclick="openAeroLightbox('${item.img}', '${safeTitle} (${item.year})', '${safeCategory} · ${item.type}')">
                <div class="poster-img-wrap">
                    <img src="${item.img}" alt="${item.title}" class="poster-img" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/600x900/0284c7/ffffff?text=${encodeURIComponent(item.title)}';">
                    <div class="poster-gloss"></div>
                    <div class="poster-badge-top-left">${item.category}</div>
                    <div class="poster-badge-top-right">${item.year}</div>
                    <div class="poster-overlay-btn">View Poster 🔍</div>
                </div>
                <div class="poster-info">
                    <div class="poster-title" title="${item.title}">${item.title}</div>
                    <div class="poster-meta">
                        <span class="poster-type">${item.type}</span>
                    </div>
                </div>
            </div>
        `;
  }).join('');
}
