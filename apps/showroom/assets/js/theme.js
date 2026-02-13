(function () {
    const THEME_KEY = 'vds-theme';
    const DARK_CLASS = 'dark-theme';

    // 저장된 테마 또는 시스템 설정 적용
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add(DARK_CLASS);
        } else {
            document.body.classList.remove(DARK_CLASS);
        }
    };

    // 초기 테마 적용 (스크립트 로드 즉시 실행하여 깜빡임 방지)
    applyTheme(getInitialTheme());

    // DOM 로드 후 버튼 이벤트 연결
    document.addEventListener('DOMContentLoaded', () => {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isDark = document.body.classList.toggle(DARK_CLASS);
                const newTheme = isDark ? 'dark' : 'light';
                localStorage.setItem(THEME_KEY, newTheme);
            });
        }
    });
})();
