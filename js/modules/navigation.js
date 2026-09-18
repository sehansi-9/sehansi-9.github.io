const TAB_TITLES = {
    home: 'Home',
    about: 'About Me',
    projects: 'Projects',
    events: 'Events & Community',
    writing: 'Writing',
    widgets: 'Widgets',
};

const MOBILE_TAB_LABELS = {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    events: 'Events',
    writing: 'Writing',
    widgets: 'Widgets',
};

let activeTabId = 'home';

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

    if (typeof playAeroChime === 'function') {
        playAeroChime('click');
    }

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

    const mobileText = document.getElementById('mobileActiveText');
    const mobileIcon = document.getElementById('mobileActiveIcon');

    if (mobileText) {
        mobileText.textContent = MOBILE_TAB_LABELS[tabId] || tabId;
    }

    if (mobileIcon) {
        mobileIcon.src = `assets/icons/${tabId}.png`;
    }

    document.querySelectorAll('.mobile-drawer-item').forEach(item => {
        item.classList.toggle(
            'active',
            item.getAttribute('data-mob-tab') === tabId
        );
    });

    const titleEl = document.getElementById('activeWindowTitle');

    if (titleEl) {
        titleEl.textContent = TAB_TITLES[tabId] || 'Home';
    }

    document.querySelectorAll('.aero-tab-panel').forEach(panel => {
        panel.classList.toggle(
            'active',
            panel.id === `tab-${tabId}`
        );
    });

    if (tabId === 'about' && typeof filterAeroAbout === 'function') {
        filterAeroAbout(currentAboutFilter);
    }

    if (tabId === 'projects' && typeof filterAeroProjects === 'function') {
        filterAeroProjects(currentProjectFilter);
    }

    if (tabId === 'writing' && typeof filterAeroWriting === 'function') {
        filterAeroWriting(currentWritingFilter);
    }

    const canvas = document.getElementById('windowContentCanvas');

    if (canvas) {
        canvas.scrollTop = 0;
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
            if (typeof openAeroProjectDetail === 'function') {
                openAeroProjectDetail(projIdx, false);
            }
            return;
        }
    }

    if (TAB_TITLES[hash]) {
        switchAeroTab(hash, null, false);
    } else {
        switchAeroTab('home', null, false);
    }
}
