function toggleAeroTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
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

    if (typeof playAeroChime === 'function') {
        playAeroChime('chime');
    }
}

function updateDuolingoTheme() {
    const duolingoStats = document.getElementById('duolingoStats');
    if (!duolingoStats) return;

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        duolingoStats.src = 'https://duolingo-stats-card.vercel.app/api?username=Sehansi.P&theme=tokyonight';
    } else {
        duolingoStats.src = 'https://duolingo-stats-card.vercel.app/api?username=Sehansi.P&theme=light';
    }
}
