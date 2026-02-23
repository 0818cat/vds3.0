const iconCache = {};
const loadingPromises = {};

/**
 * 아이콘 이름으로 SVG 파일을 로드하여 문자열로 반환합니다.
 * @param {string} iconName - 아이콘 파일 이름 (확장자 제외)
 * @returns {Promise<string>}
 */
async function loadIcon(iconName) {
    if (iconCache[iconName]) return iconCache[iconName];
    if (loadingPromises[iconName]) return loadingPromises[iconName];

    loadingPromises[iconName] = (async () => {
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
        } finally {
            delete loadingPromises[iconName];
        }
    })();

    return loadingPromises[iconName];
}

/**
 * [data-icon] 속성을 가진 요소를 찾아 아이콘을 주입합니다.
 * @param {HTMLElement|Document} root - 검색을 시작할 루트 요소
 */
async function initializeDataIcons(root = document) {
    const elements = [];

    // 루트 요소 자체가 data-icon을 가지고 있는 경우 처리
    if (root.nodeType === 1 && root.hasAttribute('data-icon')) {
        elements.push(root);
    }

    // 하위 요소들 검색
    const descendants = root.querySelectorAll('[data-icon]');
    descendants.forEach(el => elements.push(el));

    const tasks = elements.map(async (el) => {
        const iconName = el.getAttribute('data-icon');
        if (iconName) {
            const svg = await loadIcon(iconName);
            // 이미 동일한 SVG가 주입되어 있다면 스킵 (불필요한 DOM 업데이트 방지)
            if (el.innerHTML !== svg) {
                el.innerHTML = svg;
            }
        }
    });

    await Promise.all(tasks);
}

// 스크립트 로드 시 자동으로 실행하여 유동적으로 주입될 수 있도록 함
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeDataIcons());
} else {
    initializeDataIcons();
}
