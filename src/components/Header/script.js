/**
 * Header Component JavaScript
 */
class Header {
    constructor() {
        this.header = document.querySelector('.header');
        this.toggle = document.querySelector('.header__toggle');
        this.nav = document.querySelector('.header__nav');
        this.init();
    }
    
    init() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // 스크롤시 헤더 스타일 변경
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    toggleMenu() {
        this.nav.classList.toggle('active');
        this.toggle.classList.toggle('active');
    }
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

// 컴포넌트 초기화
document.addEventListener('DOMContentLoaded', () => {
    new Header();
});