/**
 * Button Loading Animation with Lottie
 * 버튼의 로딩 상태에 Lottie 애니메이션을 적용합니다.
 * 애니메이션 색상은 버튼의 텍스트 색상(currentColor)과 동일하게 설정됩니다.
 */

import lottie from 'lottie-web';

// Lottie 애니메이션 데이터 (인라인으로 포함)
const loadingAnimationData = {
    "nm": "Loading2",
    "ddd": 0,
    "h": 256,
    "w": 256,
    "meta": { "g": "@lottiefiles/toolkit-js 0.64.0" },
    "layers": [{
        "ty": 4,
        "nm": "Shape Layer 2",
        "sr": 1,
        "st": 0,
        "op": 30,
        "ip": 0,
        "ln": "51",
        "hasMask": false,
        "ao": 0,
        "ks": {
            "a": { "a": 0, "k": [13, 13.016, 0] },
            "s": { "a": 0, "k": [100, 100] },
            "p": { "a": 0, "k": [128, 128.016, 0] },
            "r": { "a": 0, "k": 0 },
            "sa": { "a": 0, "k": 0 },
            "o": { "a": 0, "k": 100 }
        },
        "shapes": [{
            "ty": "gr",
            "nm": "Ellipse 1",
            "it": [
                {
                    "ty": "el",
                    "nm": "Ellipse Path 1",
                    "d": 1,
                    "p": { "a": 0, "k": [0, 0] },
                    "s": { "a": 0, "k": [200, 200] }
                },
                {
                    "ty": "tm",
                    "nm": "Trim Paths 1",
                    "e": {
                        "a": 1,
                        "k": [
                            { "o": { "x": 0.333, "y": 0 }, "i": { "x": 0.667, "y": 1 }, "s": [0], "t": 0 },
                            { "o": { "x": 0.333, "y": 0 }, "i": { "x": 0.667, "y": 1.056 }, "s": [10], "t": 10 },
                            { "o": { "x": 0.333, "y": -0.049 }, "i": { "x": 0.667, "y": 1 }, "s": [50], "t": 20 },
                            { "s": [100], "t": 31 }
                        ]
                    },
                    "o": { "a": 0, "k": 0 },
                    "s": {
                        "a": 1,
                        "k": [
                            { "o": { "x": 0.333, "y": 0 }, "i": { "x": 0.667, "y": 1 }, "s": [0], "t": 0 },
                            { "s": [100], "t": 31 }
                        ]
                    },
                    "m": 2
                },
                {
                    "ty": "st",
                    "nm": "Stroke 1",
                    "lc": 2,
                    "lj": 1,
                    "ml": 4,
                    "o": { "a": 0, "k": 100 },
                    "w": { "a": 0, "k": 20 },
                    "c": { "a": 0, "k": [0, 0.4314, 1] }
                },
                {
                    "ty": "tr",
                    "a": { "a": 0, "k": [0, 0] },
                    "s": { "a": 0, "k": [100, 100] },
                    "p": { "a": 0, "k": [12, 13] },
                    "r": { "a": 0, "k": 0 },
                    "sa": { "a": 0, "k": 0 },
                    "o": { "a": 0, "k": 100 }
                }
            ]
        }],
        "ind": 1
    }],
    "v": "5.7.0",
    "fr": 29.97,
    "op": 29.97,
    "ip": 0,
    "assets": []
};

/**
 * RGB 색상을 0-1 범위로 변환
 */
function rgbToNormalized(r, g, b) {
    return [r / 255, g / 255, b / 255];
}

/**
 * CSS 색상 문자열을 파싱하여 정규화된 RGB 배열로 변환
 */
function parseColor(colorString) {
    // rgb(r, g, b) 형식 파싱
    const rgbMatch = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
        return rgbToNormalized(
            parseInt(rgbMatch[1]),
            parseInt(rgbMatch[2]),
            parseInt(rgbMatch[3])
        );
    }

    // hex 색상 파싱
    const hexMatch = colorString.match(/^#([0-9a-f]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1];
        return rgbToNormalized(
            parseInt(hex.substr(0, 2), 16),
            parseInt(hex.substr(2, 2), 16),
            parseInt(hex.substr(4, 2), 16)
        );
    }

    // 기본값 (파란색)
    return [0, 0.4314, 1];
}

/**
 * 로딩 버튼 초기화
 */
function initLoadingButtons() {
    const loadingButtons = document.querySelectorAll('.btn--loading');

    loadingButtons.forEach((button) => {
        // 이미 초기화된 경우 스킵
        if (button.querySelector('.btn__loading-animation')) {
            return;
        }

        // 애니메이션 컨테이너 생성
        const container = document.createElement('div');
        container.className = 'btn__loading-animation';
        button.appendChild(container);

        // 버튼의 텍스트 색상 가져오기
        const computedStyle = window.getComputedStyle(button);
        const textColor = computedStyle.color;
        const normalizedColor = parseColor(textColor);

        // 애니메이션 데이터 복사 및 색상 수정
        const animationData = JSON.parse(JSON.stringify(loadingAnimationData));
        const strokeLayer = animationData.layers[0].shapes[0].it.find(item => item.ty === 'st');
        if (strokeLayer) {
            strokeLayer.c.k = normalizedColor;
        }

        // Lottie 애니메이션 렌더링
        lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData
        });
    });
}

// DOM 로드 완료 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingButtons);
} else {
    initLoadingButtons();
}

// 동적으로 추가되는 버튼을 위한 MutationObserver
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element 노드
                if (node.classList && node.classList.contains('btn--loading')) {
                    initLoadingButtons();
                } else if (node.querySelectorAll) {
                    const loadingButtons = node.querySelectorAll('.btn--loading');
                    if (loadingButtons.length > 0) {
                        initLoadingButtons();
                    }
                }
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
