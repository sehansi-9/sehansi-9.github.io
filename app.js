
document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderAeroProjects !== 'function') {
        const scripts = [
            'js/modules/audio.js',
            'js/modules/theme.js',
            'js/modules/navigation.js',
            'js/modules/renderers.js',
            'js/modules/widgets.js',
            'js/app.js'
        ];
        scripts.forEach(src => {
            const s = document.createElement('script');
            s.src = src;
            document.head.appendChild(s);
        });
    }
});