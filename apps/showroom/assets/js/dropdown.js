/**
 * VDS 3.0 Dropdown Component Logic
 * 피그마 디자인(node-id=1039-8824) 사양에 맞춘 드롭다운 상호작용을 처리합니다.
 */

class Dropdown {
    constructor(element) {
        this.dropdown = element;
        this.trigger = element.querySelector('.dropdown__trigger');
        this.menu = element.querySelector('.menu');
        this.label = element.querySelector('.dropdown__label');

        if (!this.trigger || !this.menu) return;

        this.init();
    }

    init() {
        // 트리거 클릭 이벤트
        this.trigger.addEventListener('click', (e) => {
            if (this.trigger.disabled || this.dropdown.classList.contains('is-disabled')) return;
            this.toggle();
            e.stopPropagation();
        });

        // 메뉴 아이템 클릭 이벤트
        this.menu.querySelectorAll('.menu__item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (item.classList.contains('menu__item--disabled')) return;
                this.select(item);
                this.close();
                e.stopPropagation();
            });
        });

        // 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (!this.dropdown.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        const isOpen = this.trigger.classList.contains('is-open');
        if (isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        // 다른 열려있는 드롭다운 닫기 (선택 사항)
        document.querySelectorAll('.dropdown__trigger.is-open').forEach(openTrigger => {
            if (openTrigger !== this.trigger) {
                openTrigger.classList.remove('is-open');
                const openMenu = openTrigger.closest('.dropdown').querySelector('.menu');
                if (openMenu) openMenu.classList.remove('is-open');
            }
        });

        this.trigger.classList.add('is-open');
        this.menu.classList.add('is-open');
    }

    close() {
        this.trigger.classList.remove('is-open');
        this.menu.classList.remove('is-open');
    }

    select(item) {
        // 선택 상태 업데이트
        this.menu.querySelectorAll('.menu__item').forEach(i => i.classList.remove('menu__item--selected'));
        item.classList.add('menu__item--selected');

        // 라벨 업데이트
        const textElement = item.querySelector('.menu__text');
        if (textElement && this.label) {
            this.label.textContent = textElement.textContent;
        }

        // 커스텀 이벤트 발생 (값 변경 알림용)
        const event = new CustomEvent('vds-change', {
            detail: {
                value: item.dataset.value,
                text: textElement ? textElement.textContent : ''
            }
        });
        this.dropdown.dispatchEvent(event);
    }
}

/**
 * 전역 초기화 함수
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(el => {
        if (!el.__vds_dropdown_initialized) {
            new Dropdown(el);
            el.__vds_dropdown_initialized = true;
        }
    });
}

// DOM 로드 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdowns);
} else {
    initDropdowns();
}

// 동적 엘리먼트 관찰
const vdsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
                if (node.classList && node.classList.contains('dropdown')) {
                    initDropdowns();
                } else if (node.querySelectorAll) {
                    const found = node.querySelectorAll('.dropdown');
                    if (found.length > 0) initDropdowns();
                }
            }
        });
    });
});

vdsObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// 전역 노출 (필요 시)
window.initDropdowns = initDropdowns;
