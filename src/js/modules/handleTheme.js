export function initTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    if (!themeSwitch) return;

    const body = document.body;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    themeSwitch.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}