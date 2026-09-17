window.addEventListener('load', () => {
    if (typeof isSoundEnabled !== 'undefined' && isSoundEnabled) {
        if (typeof startBackgroundMusic === 'function') {
            startBackgroundMusic();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateDuolingoTheme === 'function') updateDuolingoTheme();
    if (typeof updateGithubTheme === 'function') updateGithubTheme();
    if (typeof renderAeroProjects === 'function') renderAeroProjects();
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
        loadLastFM();
        setInterval(loadLastFM, 30000);
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
