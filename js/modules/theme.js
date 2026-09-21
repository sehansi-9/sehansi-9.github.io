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
    updateGithubTheme();

    if (typeof playAeroChime === 'function') {
        playAeroChime('chime');
    }
}

function initializeAeroTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    const sunIcon = document.getElementById('themeIconSun');
    const moonIcon = document.getElementById('themeIconMoon');
    const sunIconMob = document.getElementById('themeIconSunMob');
    const moonIconMob = document.getElementById('themeIconMoonMob');

    if (savedTheme === 'dark') {
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
    updateGithubTheme();
}

document.addEventListener('DOMContentLoaded', initializeAeroTheme);

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

function updateGithubTheme() {
    const githubStats = document.getElementById('githubStats');
    const githubGraph = document.getElementById('githubGraph');
    const savedTheme = localStorage.getItem('theme');

    if (githubStats) {
        if (savedTheme === 'dark') {
            githubStats.src = 'https://streak-stats.demolab.com/?user=sehansi-9&theme=tokyonight&hide_border=true&background=00000000&ring=38bdf8&fire=38bdf8&currStreakNum=38bdf8';
        } else {
            githubStats.src = 'https://streak-stats.demolab.com/?user=sehansi-9&theme=default&hide_border=true&background=00000000&ring=0284c7&fire=0284c7&currStreakNum=0284c7';
        }
    }

    if (githubGraph) {
        if (savedTheme === 'dark') {
            githubGraph.src = 'https://ghchart.rshah.org/38bdf8/sehansi-9';
        } else {
            githubGraph.src = 'https://ghchart.rshah.org/0284c7/sehansi-9';
        }
    }
}
