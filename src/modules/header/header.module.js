/**
 * 📦 헤더 모듈 (완전 독립)
 * 
 * 다른 모듈과 완전히 독립적으로 동작
 * 이 파일만 수정해도 다른 부분에 영향 없음
 */
(function() {
    'use strict';
    
    // 헤더 컴포넌트 클래스
    class HeaderModule {
        constructor(selector, options = {}) {
            // 기본 설정
            this.selector = selector;
            this.element = document.querySelector(selector);
            this.options = {
                sticky: true,
                animated: true,
                ...options
            };
            
            // 상태 관리
            this.state = {
                isOpen: false,
                isScrolled: false,
                currentPage: 'home'
            };
            
            // 요소가 있을 때만 초기화
            if (this.element) {
                this.init();
            }
        }
        
        // 초기화
        init() {
            console.log('🎯 Header 모듈 초기화');
            
            // HTML 생성
            this.createHTML();
            
            // 이벤트 연결
            this.attachEvents();
            
            // 초기 스타일 적용
            this.applyStyles();
        }
        
        // HTML 생성 (템플릿)
        createHTML() {
            const template = `
                <div class="header-container">
                    <div class="header-logo">
                        <a href="/">🚀 My Project</a>
                    </div>
                    
                    <nav class="header-nav">
                        <ul class="header-menu">
                            <li><a href="#home" data-page="home">홈</a></li>
                            <li><a href="#about" data-page="about">소개</a></li>
                            <li><a href="#services" data-page="services">서비스</a></li>
                            <li><a href="#contact" data-page="contact">연락처</a></li>
                        </ul>
                    </nav>
                    
                    <button class="header-toggle" aria-label="메뉴">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            `;
            
            // 안전하게 HTML 삽입
            if (this.element) {
                this.element.innerHTML = template;
            }
        }
        
        // 이벤트 연결
        attachEvents() {
            // 모바일 메뉴 토글
            const toggle = this.element.querySelector('.header-toggle');
            if (toggle) {
                toggle.addEventListener('click', () => this.toggleMenu());
            }
            
            // 메뉴 클릭
            const menuItems = this.element.querySelectorAll('.header-menu a');
            menuItems.forEach(item => {
                item.addEventListener('click', (e) => this.handleMenuClick(e));
            });
            
            // 스크롤 이벤트 (스티키 헤더)
            if (this.options.sticky) {
                window.addEventListener('scroll', () => this.handleScroll());
            }
        }
        
        // 메뉴 토글
        toggleMenu() {
            this.state.isOpen = !this.state.isOpen;
            
            const nav = this.element.querySelector('.header-nav');
            const toggle = this.element.querySelector('.header-toggle');
            
            if (nav && toggle) {
                nav.classList.toggle('active', this.state.isOpen);
                toggle.classList.toggle('active', this.state.isOpen);
            }
        }
        
        // 메뉴 클릭 처리
        handleMenuClick(e) {
            e.preventDefault();
            
            const page = e.target.dataset.page;
            if (page) {
                this.setActivePage(page);
                this.state.isOpen = false;
                const nav = this.element.querySelector('.header-nav');
                if (nav) nav.classList.remove('active');
            }
        }
        
        // 활성 페이지 설정
        setActivePage(page) {
            this.state.currentPage = page;
            
            // 모든 메뉴에서 active 제거
            const menuItems = this.element.querySelectorAll('.header-menu a');
            menuItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === page) {
                    item.classList.add('active');
                }
            });
            
            console.log(`📍 현재 페이지: ${page}`);
        }
        
        // 스크롤 처리
        handleScroll() {
            const scrolled = window.scrollY > 50;
            
            if (scrolled !== this.state.isScrolled) {
                this.state.isScrolled = scrolled;
                this.element.classList.toggle('scrolled', scrolled);
            }
        }
        
        // 스타일 적용
        applyStyles() {
            // CSS가 없으면 인라인 스타일 적용
            if (!document.querySelector('#header-module-styles')) {
                const styles = document.createElement('style');
                styles.id = 'header-module-styles';
                styles.textContent = this.getCSS();
                document.head.appendChild(styles);
            }
        }
        
        // CSS 반환 (이 모듈 전용 스타일)
        getCSS() {
            return `
                /* 헤더 모듈 스타일 (독립적) */
                .header-module {
                    background: #333;
                    color: white;
                    padding: 1rem 0;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    transition: all 0.3s ease;
                }
                
                .header-module.scrolled {
                    background: #222;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    padding: 0.5rem 0;
                }
                
                .header-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .header-logo a {
                    color: white;
                    font-size: 1.5rem;
                    font-weight: bold;
                    text-decoration: none;
                }
                
                .header-menu {
                    display: flex;
                    list-style: none;
                    gap: 2rem;
                    margin: 0;
                    padding: 0;
                }
                
                .header-menu a {
                    color: white;
                    text-decoration: none;
                    transition: opacity 0.3s;
                    padding: 0.5rem;
                }
                
                .header-menu a:hover,
                .header-menu a.active {
                    opacity: 0.8;
                    border-bottom: 2px solid white;
                }
                
                .header-toggle {
                    display: none;
                    flex-direction: column;
                    gap: 4px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                }
                
                .header-toggle span {
                    width: 25px;
                    height: 2px;
                    background: white;
                    transition: all 0.3s;
                }
                
                /* 모바일 반응형 */
                @media (max-width: 768px) {
                    .header-toggle {
                        display: flex;
                    }
                    
                    .header-nav {
                        position: fixed;
                        top: 60px;
                        left: -100%;
                        width: 100%;
                        background: #333;
                        transition: left 0.3s;
                    }
                    
                    .header-nav.active {
                        left: 0;
                    }
                    
                    .header-menu {
                        flex-direction: column;
                        padding: 2rem;
                    }
                }
            `;
        }
        
        // 컴포넌트 제거
        destroy() {
            // 이벤트 리스너 제거
            window.removeEventListener('scroll', () => this.handleScroll());
            
            // HTML 제거
            if (this.element) {
                this.element.innerHTML = '';
            }
            
            console.log('🗑️ Header 모듈 제거됨');
        }
    }
    
    // 전역에 등록 (다른 모듈과 충돌 없음)
    window.HeaderModule = HeaderModule;
    
})();