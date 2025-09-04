// Utility Functions

/**
 * 날짜 포맷팅
 * @param {Date} date 
 * @returns {string}
 */
function formatDate(date = new Date()) {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

/**
 * 디바운스 함수
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 스로틀 함수
 * @param {Function} func
 * @param {number} limit
 * @returns {Function}
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 요소 선택 헬퍼
 * @param {string} selector 
 * @returns {Element}
 */
function $(selector) {
    return document.querySelector(selector);
}

/**
 * 모든 요소 선택 헬퍼
 * @param {string} selector 
 * @returns {NodeList}
 */
function $$(selector) {
    return document.querySelectorAll(selector);
}

/**
 * 이벤트 리스너 추가 헬퍼
 * @param {Element} element 
 * @param {string} event 
 * @param {Function} handler 
 */
function on(element, event, handler) {
    if (element && event && handler) {
        element.addEventListener(event, handler);
    }
}

/**
 * 클래스 토글
 * @param {Element} element 
 * @param {string} className 
 */
function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}

/**
 * 로컬 스토리지 헬퍼
 */
const storage = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return localStorage.getItem(key);
        }
    },
    set(key, value) {
        if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.setItem(key, value);
        }
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    }
};

// 페이지 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 현재 시간 표시 (예제)
    const timeElement = $('.current-time');
    if (timeElement) {
        setInterval(() => {
            timeElement.textContent = formatDate();
        }, 1000);
    }
    
    // 네비게이션 활성화
    const navLinks = $$('.nav-list a');
    navLinks.forEach(link => {
        on(link, 'click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    console.log('🛠️ Utils loaded successfully');
});