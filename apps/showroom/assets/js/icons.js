const iconCache = {};

/**
 * 아이콘 이름으로 SVG 파일을 로드하여 문자열로 반환합니다.
 * @param {string} iconName - 아이콘 파일 이름 (확장자 제외)
 * @returns {Promise<string>}
 */
async function loadIcon(iconName) {
    if (iconCache[iconName]) return iconCache[iconName];

    try {
        // 상대 경로 설정 (apps/showroom/*.html 기준)
        const response = await fetch(`../../packages/ui/assets/icons/${iconName}.svg`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const svgText = await response.text();
        iconCache[iconName] = svgText;
        return svgText;
    } catch (e) {
        console.error('Failed to load icon:', iconName, e);
        return '';
    }
}

/**
 * [data-icon] 속성을 가진 모든 요소를 찾아 아이콘을 주입합니다.
 */
async function initializeDataIcons() {
    const elements = document.querySelectorAll('[data-icon]');
    const tasks = Array.from(elements).map(async (el) => {
        const iconName = el.getAttribute('data-icon');
        if (iconName) {
            const svg = await loadIcon(iconName);
            el.innerHTML = svg;
        }
    });
    await Promise.all(tasks);
}

// 스크립트 로드 시 자동으로 실행하여 유동적으로 주입될 수 있도록 함
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDataIcons);
} else {
    initializeDataIcons();
}
