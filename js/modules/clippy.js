(function () {
  'use strict';

  let isClippyOpen = false;
  let searchIndex = [];
  let clippyAgent = null;
  let idleTeaserTimer = null;
  let animThrottle = null;

  function buildKnowledgeIndex() {
    const index = [];

    if (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) {
      PROJECTS.forEach((proj, idx) => {
        const textBlocks = [];
        if (proj.desc) textBlocks.push(proj.desc);
        if (proj.tags && proj.tags.length) textBlocks.push(`Tags: ${proj.tags.join(', ')}`);
        if (proj.detail) {
          if (proj.detail.problem) textBlocks.push(`Problem: ${proj.detail.problem}`);
          if (Array.isArray(proj.detail.highlights)) {
            proj.detail.highlights.forEach(h => textBlocks.push(h));
          }
          if (Array.isArray(proj.detail.approach)) {
            proj.detail.approach.forEach(a => textBlocks.push(`Approach: ${a.heading || ''}: ${a.body || ''}`));
          }
          if (proj.detail.stack) {
            Object.entries(proj.detail.stack).forEach(([k, v]) => {
              const valStr = Array.isArray(v) ? v.join(', ') : String(v);
              textBlocks.push(`${k.charAt(0).toUpperCase() + k.slice(1)}: ${valStr}`);
            });
          }
          if (Array.isArray(proj.detail.sdgs)) {
            proj.detail.sdgs.forEach(s => textBlocks.push(`${s.title || ''}: ${s.desc || ''}`));
          }
          if (Array.isArray(proj.detail.snapshots)) {
            proj.detail.snapshots.forEach(s => { if (s.alt) textBlocks.push(s.alt); });
          }
        }
        if (proj.org) textBlocks.push(proj.org);

        const fullSearchContent = [proj.title || '', ...textBlocks].join(' ').toLowerCase();

        index.push({
          category: 'Projects',
          categoryOrder: 1,
          title: proj.title,
          defaultSubtitle: proj.org ? proj.org : (proj.tags ? proj.tags.slice(0, 3).join(', ') : 'Project'),
          textBlocks,
          searchText: fullSearchContent,
          action: () => {
            if (typeof switchAeroTab === 'function') switchAeroTab('projects');
            if (typeof openAeroProjectDetail === 'function') openAeroProjectDetail(idx);
          }
        });
      });
    }

    if (typeof EXPERIENCE !== 'undefined' && Array.isArray(EXPERIENCE)) {
      EXPERIENCE.forEach((exp) => {
        const textBlocks = [];
        if (exp.role) textBlocks.push(`${exp.role} (${exp.type || ''}) · ${exp.location || ''}`);
        if (exp.period) textBlocks.push(exp.period);
        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach(h => textBlocks.push(h));
        }

        const fullSearchContent = [exp.title || '', exp.company || '', ...textBlocks].join(' ').toLowerCase();

        index.push({
          category: 'Experience',
          categoryOrder: 2,
          title: exp.company || exp.title,
          defaultSubtitle: exp.role ? `${exp.role} · ${exp.period || ''}` : 'Experience',
          textBlocks,
          searchText: fullSearchContent,
          action: () => {
            if (typeof switchAeroTab === 'function') switchAeroTab('about');
            if (typeof filterAeroAbout === 'function') filterAeroAbout('experience');
            const expEl = document.getElementById('about-section-experience');
            if (expEl) expEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      });
    }

    if (typeof EDUCATION !== 'undefined' && Array.isArray(EDUCATION)) {
      EDUCATION.forEach((edu) => {
        const textBlocks = [];
        if (edu.degree) textBlocks.push(edu.degree);
        if (edu.affiliation) textBlocks.push(edu.affiliation);
        if (edu.details) textBlocks.push(edu.details);
        if (Array.isArray(edu.sections)) {
          edu.sections.forEach(s => textBlocks.push(`${s.label || ''} ${(s.tags || []).join(', ')}`));
        }

        const fullSearchContent = [edu.title || '', edu.institution || '', ...textBlocks].join(' ').toLowerCase();

        index.push({
          category: 'Education',
          categoryOrder: 3,
          title: edu.institution || edu.title,
          defaultSubtitle: edu.degree || 'Education',
          textBlocks,
          searchText: fullSearchContent,
          action: () => {
            if (typeof switchAeroTab === 'function') switchAeroTab('about');
            if (typeof filterAeroAbout === 'function') filterAeroAbout('education');
            const eduEl = document.getElementById('about-section-education');
            if (eduEl) eduEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      });
    }

    if (typeof BLOG !== 'undefined') {
      const articles = [...(BLOG.tech || []), ...(BLOG.life || [])];
      articles.forEach(art => {
        const textBlocks = [];
        if (art.desc) textBlocks.push(art.desc);
        if (art.meta) textBlocks.push(art.meta);

        const fullSearchContent = [art.title || '', ...textBlocks].join(' ').toLowerCase();

        index.push({
          category: 'Writing',
          categoryOrder: 4,
          title: art.title,
          defaultSubtitle: art.meta || 'Article',
          textBlocks,
          searchText: fullSearchContent,
          action: () => {
            if (typeof switchAeroTab === 'function') switchAeroTab('writing');
            if (typeof filterAeroWriting === 'function') filterAeroWriting('all');
          }
        });
      });
    }

    if (typeof CERTIFICATIONS !== 'undefined' && Array.isArray(CERTIFICATIONS)) {
      CERTIFICATIONS.forEach(cert => {
        const textBlocks = [];
        if (cert.issuer) textBlocks.push(cert.issuer);
        if (cert.badge) textBlocks.push(cert.badge);
        if (cert.date) textBlocks.push(cert.date);

        const fullSearchContent = [cert.title || '', ...textBlocks].join(' ').toLowerCase();

        index.push({
          category: 'Certifications',
          categoryOrder: 5,
          title: cert.title,
          defaultSubtitle: cert.issuer ? `${cert.issuer} · ${cert.date || ''}` : 'Certificate',
          textBlocks,
          searchText: fullSearchContent,
          action: () => {
            if (typeof switchAeroTab === 'function') switchAeroTab('about');
            if (typeof filterAeroAbout === 'function') filterAeroAbout('certs');
          }
        });
      });
    }

    if (typeof EVENTS !== 'undefined' && Array.isArray(EVENTS)) {
      EVENTS.forEach(ev => {
        const textBlocks = [];
        if (ev.desc) textBlocks.push(ev.desc.replace(/<[^>]*>/g, ''));
        if (ev.alt) textBlocks.push(ev.alt);

        const fullSearchContent = [ev.title || '', ...textBlocks].join(' ').toLowerCase();

        index.push({
          category: 'Events & Community',
          categoryOrder: 6,
          title: ev.title,
          defaultSubtitle: ev.desc ? ev.desc.replace(/<[^>]*>/g, '').slice(0, 50) + '...' : 'Event',
          textBlocks,
          searchText: fullSearchContent,
          action: () => {
            if (typeof switchAeroTab === 'function') switchAeroTab('events');
            if (typeof openAeroLightbox === 'function') {
              openAeroLightbox(ev.src, ev.title, ev.alt || '');
            }
          }
        });
      });
    }

    searchIndex = index;
  }

  async function loadRealClippy() {
    try {
      const [{ initAgent }, agentsModule] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/clippyjs/dist/index.mjs'),
        import('https://cdn.jsdelivr.net/npm/clippyjs/dist/agents/index.mjs')
      ]);

      clippyAgent = await initAgent(agentsModule.Clippy);
      setupClippyAgent();
    } catch (err) {
      console.error('Clippy failed to load:', err);
    }
  }
  function patchClippyBalloonAboveOnly() {
    if (!clippyAgent || !clippyAgent._balloon) return;
    const balloon = clippyAgent._balloon;
    const MARGIN_FROM_EDGE = 5;

    balloon.reposition = function () {
      const targetRect = this._targetEl.getBoundingClientRect();
      const targetW = this._targetEl.offsetWidth;
      const bW = this._balloon.offsetWidth;
      const bH = this._balloon.offsetHeight;
      const winW = window.innerWidth;

      let left = targetRect.left + targetW - bW;
      left = Math.max(MARGIN_FROM_EDGE, Math.min(left, winW - bW - MARGIN_FROM_EDGE));

      let top = targetRect.top - bH - this._BALLOON_MARGIN;
      top = Math.max(MARGIN_FROM_EDGE, top);

      this._balloon.style.top = top + 'px';
      this._balloon.style.left = left + 'px';
      this._positionTip('top-left');
    };
  }

  function speakInstant(text, holdMs) {
    if (!clippyAgent || !clippyAgent._balloon) return;
    const balloon = clippyAgent._balloon;
    balloon._hidden = false;
    balloon.show();
    const c = balloon._content;
    c.style.height = 'auto';
    c.style.width = 'auto';
    c.textContent = text;
    balloon.reposition();

    clearTimeout(balloon._instantHideTimer);
    if (holdMs) {
      balloon._instantHideTimer = setTimeout(() => balloon.hide(), holdMs);
    }
  }

  function setupClippyAgent() {
    const el = clippyAgent._el;
    el.id = 'clippyRealAvatar';
    el.classList.add('clippy-real-avatar');
    el.title = 'Click me to search anything!';

    patchClippyBalloonAboveOnly();

    positionClippyBottomRight();

    clippyAgent.show();

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof playAeroChime === 'function') playAeroChime('click');
      toggleClippyDialog();
    });

    window.addEventListener('resize', () => {
      if (isClippyOpen) positionClippyDialog();
    });


    startIdleTeaser();
  }

  function positionClippyBottomRight() {
    if (!clippyAgent) return;
    const el = clippyAgent._el;
    const isMobile = window.innerWidth <= 768;
    const w = el.offsetWidth || 124;
    const h = el.offsetHeight || 93;
    const rightOffset = isMobile ? 10 : 0;
    const bottomOffset = isMobile ? 7 : 30;
    el.style.left = Math.max(8, window.innerWidth - w - rightOffset) + 'px';
    el.style.top = Math.max(8, window.innerHeight - h - bottomOffset) + 'px';
  }

  function startIdleTeaser() {
    if (idleTeaserTimer) clearInterval(idleTeaserTimer);
    idleTeaserTimer = setInterval(() => {
      if (!clippyAgent || isClippyOpen) return;
      speakInstant("Wanna find something? Click me!", 4000);
    }, 22000);
  }

  function nudgeClippy(animationName) {
    if (!clippyAgent) return;
    clearTimeout(animThrottle);
    animThrottle = setTimeout(() => {
      clippyAgent.stopCurrent();
      clippyAgent.play(animationName);
    }, 120);
  }

  function createClippyDialog() {
    if (document.getElementById('clippyDialog')) return;

    const dialog = document.createElement('div');
    dialog.id = 'clippyDialog';
    dialog.className = 'clippy-dialog';
    dialog.style.display = 'none';

    dialog.innerHTML = `
      <div class="clippy-header">
        <div class="clippy-title">
          <span>📎</span>
          <span>Clippy Assistant</span>
        </div>
        <button class="clippy-close-btn" id="clippyCloseBtn" title="Close">×</button>
      </div>

      <div class="clippy-speech-bubble" id="clippySpeechText">
        Hi there! :3 What would you like to find?
      </div>

      <div class="clippy-chips">
        <button class="clippy-chip" data-query="Full-Stack">Full Stack</button>
        <button class="clippy-chip" data-query="Data"> Data</button>
        <button class="clippy-chip" data-query="AI"> AI</button>
      </div>

      <form class="clippy-form" id="clippyForm">
        <div class="clippy-input-wrap">
          <input type="text" id="clippyInput" class="clippy-input" placeholder="Search anything..." autocomplete="off" spellcheck="false">
        </div>
      </form>

      <div class="clippy-results" id="clippyResults" style="display: none;"></div>
    `;

    document.body.appendChild(dialog);

    document.getElementById('clippyCloseBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleClippyDialog(false);
    });

    dialog.querySelectorAll('.clippy-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-query');
        const input = document.getElementById('clippyInput');
        if (input) {
          input.value = q;
          performClippySearch(q);
        }
      });
    });

    document.getElementById('clippyForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('clippyInput');
      if (input) {
        performClippySearch(input.value);
      }
    });

    document.getElementById('clippyInput')?.addEventListener('input', (e) => {
      performClippySearch(e.target.value);
    });
  }

  function positionClippyDialog() {
    const dialog = document.getElementById('clippyDialog');
    if (!dialog || !clippyAgent) return;

    const rect = clippyAgent._el.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      dialog.style.removeProperty('--clippy-tip-left');
      return;
    }

    const dialogWidth = dialog.offsetWidth || 370;
    let left = rect.left + rect.width / 2 - dialogWidth / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - dialogWidth - 12));

    const bottom = Math.max(12, window.innerHeight - rect.top + 14);
    const tipLeft = Math.max(24, Math.min(dialogWidth - 24, rect.left + rect.width / 2 - left));

    dialog.style.left = left + 'px';
    dialog.style.right = 'auto';
    dialog.style.bottom = bottom + 'px';
    dialog.style.setProperty('--clippy-tip-left', tipLeft + 'px');
  }

  function performClippySearch(query) {
    const resultsContainer = document.getElementById('clippyResults');
    const speechText = document.getElementById('clippySpeechText');
    if (!resultsContainer) return;

    const rawInput = (query || '').trim();
    const q = rawInput.toLowerCase();

    if (!rawInput) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      if (speechText) {
        speechText.textContent = "Hi there! :3 What would you like to find?";
      }
      return;
    }

    if (rawInput.length < 3 && !['sdg', 'ai', 'ui', 'ux'].includes(q)) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      if (speechText) {
        speechText.textContent = `Type at least 3 characters to search...`;
      }
      return;
    }

    if (!searchIndex.length) {
      buildKnowledgeIndex();
    }

    nudgeClippy('Searching');

    const rawTerms = rawInput.split(/\s+/).filter(Boolean);
    const endsWithSpace = rawInput.endsWith(' ');
    const escapedTerms = rawTerms.map(term => term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const phrasePattern = escapedTerms.join('\\s+');
    const phraseRegex = new RegExp(endsWithSpace ? `\\b${phrasePattern}\\b` : `\\b${phrasePattern}`, 'i');

    const matched = searchIndex.filter(item => {
      return phraseRegex.test(item.searchText);
    });

    if (matched.length === 0) {
      resultsContainer.innerHTML = `<div style="font-size:12px;color:var(--ink-muted);padding:8px;text-align:center;"></div>`;
      resultsContainer.style.display = 'flex';
      if (speechText) {
        speechText.textContent = `Hmm, I couldn't find any results for "${rawInput}".`;
      }
      nudgeClippy('Explain');
      return;
    }
    const groups = {};
    matched.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = {
          order: item.categoryOrder,
          items: []
        };
      }
      groups[item.category].items.push(item);
    });

    const sortedCategories = Object.keys(groups).sort((a, b) => groups[a].order - groups[b].order);

    if (speechText) {
      speechText.innerHTML = `I found <strong>${matched.length}</strong> matching place${matched.length > 1 ? 's' : ''} for you:`;
    }

    nudgeClippy('Congratulate');

    let flatIndex = 0;
    let html = '';

    sortedCategories.forEach(cat => {
      html += `<div class="clippy-category-group">`;
      html += `  <div class="clippy-category-title">${escapeHtml(cat)}</div>`;
      groups[cat].items.forEach(item => {
        const currentIdx = flatIndex++;
        const highlightedTitle = highlightSearchTerm(item.title, rawInput);
        const contextualSubtitle = extractContextualSubtitle(item, phraseRegex, rawInput);

        html += `  <div class="clippy-result-item" data-clippy-idx="${currentIdx}">`;
        html += `    <div class="clippy-result-info">`;
        html += `      <span class="clippy-result-title">${highlightedTitle}</span>`;
        html += `      <span class="clippy-result-subtitle">${contextualSubtitle}</span>`;
        html += `    </div>`;
        html += `    <span class="clippy-result-arrow">➔</span>`;
        html += `  </div>`;
      });
      html += `</div>`;
    });

    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'flex';
    positionClippyDialog();

    flatIndex = 0;
    sortedCategories.forEach(cat => {
      groups[cat].items.forEach(item => {
        const targetIdx = flatIndex++;
        const el = resultsContainer.querySelector(`[data-clippy-idx="${targetIdx}"]`);
        if (el) {
          el.addEventListener('click', () => {
            item.action();
            toggleClippyDialog(false);
          });
        }
      });
    });
  }

  function extractContextualSubtitle(item, phraseRegex, rawInput) {
    const blocks = item.textBlocks || [];
    if (!phraseRegex) {
      return highlightSearchTerm(item.defaultSubtitle || '', rawInput);
    }

    let matchingBlock = null;
    for (const block of blocks) {
      if (phraseRegex.test(block)) {
        matchingBlock = block;
        break;
      }
    }

    if (matchingBlock) {
      const match = matchingBlock.match(phraseRegex);
      if (match && typeof match.index === 'number') {
        const matchIndex = match.index;
        const matchedLength = match[0].length;

        let start = Math.max(0, matchIndex - 16);
        let end = Math.min(matchingBlock.length, matchIndex + matchedLength + 30);

        if (start > 0) {
          const spaceIdx = matchingBlock.indexOf(' ', start);
          if (spaceIdx !== -1 && spaceIdx < matchIndex) {
            start = spaceIdx + 1;
          }
        }

        if (end < matchingBlock.length) {
          const spaceIdx = matchingBlock.lastIndexOf(' ', end);
          if (spaceIdx !== -1 && spaceIdx > matchIndex + matchedLength) {
            end = spaceIdx;
          }
        }

        let snippet = matchingBlock.slice(start, end).trim();
        if (start > 0) snippet = `... ${snippet}`;
        if (end < matchingBlock.length) snippet = `${snippet} ...`;

        return highlightSearchTerm(snippet, rawInput);
      }
    }

    return highlightSearchTerm(item.defaultSubtitle || '', rawInput);
  }

  function highlightSearchTerm(text, rawInput) {
    if (!text || !rawInput) return escapeHtml(text);

    const trimmed = rawInput.trim();
    if (!trimmed) return escapeHtml(text);

    const rawTerms = trimmed.split(/\s+/).filter(Boolean);
    const escapedTerms = rawTerms.map(term => term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const phrasePattern = escapedTerms.join('\\s+');
    const regex = new RegExp(`(\\b${phrasePattern})`, 'gi');

    return escapeHtml(text).replace(regex, '<mark class="search-highlight" style="background:rgba(253,224,71,0.45);border-radius:3px;padding:0 2px;">$1</mark>');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  function toggleClippyDialog(forceState) {
    const dialog = document.getElementById('clippyDialog');
    if (!dialog) return;

    const wasOpen = isClippyOpen;
    isClippyOpen = (typeof forceState === 'boolean') ? forceState : !isClippyOpen;

    if (isClippyOpen) {
      dialog.style.display = 'flex';
      positionClippyDialog();

      if (clippyAgent) {
        clippyAgent.stopCurrent();
      }

      const input = document.getElementById('clippyInput');
      if (input) {
        setTimeout(() => input.focus(), 60);
      }
    } else {
      dialog.style.display = 'none';
      if (clippyAgent && wasOpen) {
        clippyAgent.stopCurrent();
        clippyAgent.closeBalloon();
      }
    }
  }

  function initClippy() {
    buildKnowledgeIndex();
    createClippyDialog();
    loadRealClippy();
  }

  document.addEventListener('click', (e) => {
    const isClippyElement = e.target.closest('.clippy-real-avatar, #clippyDialog');

    if (!isClippyElement && isClippyOpen) {
      toggleClippyDialog(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isClippyOpen) {
      toggleClippyDialog(false);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClippy);
  } else {
    initClippy();
  }

  window.toggleClippy = toggleClippyDialog;
})();