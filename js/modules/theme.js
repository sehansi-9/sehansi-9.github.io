const GITHUB_USER = 'sehansi-9';
const DUOLINGO_USER = 'Sehansi.P';

function applyThemeIcons(isDark) {
    const sunIcon = document.getElementById('themeIconSun');
    const moonIcon = document.getElementById('themeIconMoon');
    const sunIconMob = document.getElementById('themeIconSunMob');
    const moonIconMob = document.getElementById('themeIconMoonMob');

    if (sunIcon) sunIcon.style.display = isDark ? 'block' : 'none';
    if (moonIcon) moonIcon.style.display = isDark ? 'none' : 'block';
    if (sunIconMob) sunIconMob.style.display = isDark ? 'block' : 'none';
    if (moonIconMob) moonIconMob.style.display = isDark ? 'none' : 'block';
}

function toggleAeroTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextIsDark = !isDark;

    if (nextIsDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');

    applyThemeIcons(nextIsDark);
    updateDuolingoTheme(nextIsDark);
    updateGithubTheme(nextIsDark);

    if (typeof playAeroChime === 'function') {
        playAeroChime('chime');
    }
}

function initializeAeroTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';

    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    applyThemeIcons(isDark);
    updateDuolingoTheme(isDark);
    updateGithubTheme(isDark);
}

document.addEventListener('DOMContentLoaded', initializeAeroTheme);

function updateDuolingoTheme(isDark) {
    const duolingoStats = document.getElementById('duolingoStats');
    if (!duolingoStats) return;

    if (isDark === undefined) isDark = localStorage.getItem('theme') === 'dark';

    duolingoStats.src = isDark
        ? `https://duolingo-stats-card.vercel.app/api?username=${DUOLINGO_USER}&theme=tokyonight`
        : `https://duolingo-stats-card.vercel.app/api?username=${DUOLINGO_USER}&theme=light`;
}

function updateGithubTheme(isDark) {
    const githubStats = document.getElementById('githubStats');
    const githubGraph = document.getElementById('githubGraph');

    if (isDark === undefined) isDark = localStorage.getItem('theme') === 'dark';

    if (githubStats) {
        githubStats.src = isDark
            ? `https://streak-stats.demolab.com/?user=${GITHUB_USER}&theme=tokyonight&hide_border=true&background=00000000&ring=38bdf8&fire=38bdf8&currStreakNum=38bdf8`
            : `https://streak-stats.demolab.com/?user=${GITHUB_USER}&theme=default&hide_border=true&background=00000000&ring=0284c7&fire=0284c7&currStreakNum=0284c7`;
    }

    if (githubGraph) {
        githubGraph.src = isDark
            ? `https://ghchart.rshah.org/38bdf8/${GITHUB_USER}`
            : `https://ghchart.rshah.org/0284c7/${GITHUB_USER}`;
    }
}
