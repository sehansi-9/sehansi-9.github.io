const AVATAR_URL = 'https://drive.google.com/thumbnail?id=16U6YnlQniuHm4fTtTtWyCrB0L4BAJxER&sz=w400';

window.addEventListener('load', () => {
    if (typeof isSoundEnabled !== 'undefined' && isSoundEnabled) {
        if (typeof startBackgroundMusic === 'function') {
            startBackgroundMusic();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    ['introAvatarHome', 'introAvatarAbout'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.src = AVATAR_URL;
    });

    if (typeof updateDuolingoTheme === 'function') updateDuolingoTheme();
    if (typeof updateGithubTheme === 'function') updateGithubTheme();
    if (typeof renderAeroProjects === 'function') renderAeroProjects();
    if (typeof renderAeroExperience === 'function') renderAeroExperience();
    if (typeof renderAeroEducation === 'function') renderAeroEducation();
    if (typeof renderAeroCertifications === 'function') renderAeroCertifications();
    if (typeof renderAeroEvents === 'function') renderAeroEvents();
    if (typeof renderAeroWriting === 'function') renderAeroWriting();
    if (typeof filterAeroAbout === 'function') filterAeroAbout('experience');
    if (typeof filterAeroWriting === 'function') filterAeroWriting('all');
    if (typeof renderAeroWatched === 'function') renderAeroWatched();
    if (typeof initAeroBubbles === 'function') initAeroBubbles();

    if (typeof updateClock === 'function') {
        updateClock();
        setInterval(updateClock, 1000);
    }
    if (typeof loadWeather === 'function') {
        loadWeather();
        setInterval(loadWeather, 15 * 60 * 1000);
    }
    if (typeof loadLastFM === 'function') {
        const interval = (typeof REFRESH_INTERVAL !== 'undefined') ? REFRESH_INTERVAL : 30000;
        loadLastFM();
        setInterval(loadLastFM, interval);
    }

    if (typeof handleHashRouting === 'function') handleHashRouting();
});

window.addEventListener('hashchange', () => {
    if (typeof handleHashRouting === 'function') handleHashRouting();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (typeof closeLightbox === 'function') closeLightbox();
        if (typeof closeProjectModal === 'function') closeProjectModal();
    }
});
