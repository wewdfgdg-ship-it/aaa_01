/**
 * 🎯 컴포넌트 기본 구조 (Component Base Class)
 * 
 * 모든 컴포넌트가 상속받는 기본 클래스
 * 하나가 망가져도 다른 것에 영향 없음
 */
class Component {
    constructor(selector, options = {}) {
        // 안전 장치: 요소가 없어도 에러 안남
        this.element = document.querySelector(selector);
        this.options = options;
        this.state = {};
        
        // 요소가 있을 때만 초기화
        if (this.element) {
            this.init();
        } else {
            console.warn(`⚠️ 요소를 찾을 수 없음: ${selector}`);
        }
    }
    
    // 초기화 (자식 클래스에서 재정의)
    init() {
        try {
            this.render();
            this.attachEvents();
        } catch (error) {
            this.handleError(error);
        }
    }
    
    // 렌더링 (자식 클래스에서 재정의)
    render() {
        // 기본 렌더링 로직
    }
    
    // 이벤트 연결 (자식 클래스에서 재정의)
    attachEvents() {
        // 기본 이벤트 로직
    }
    
    // 상태 업데이트 (안전하게)
    setState(newState) {
        try {
            this.state = { ...this.state, ...newState };
            this.render();
        } catch (error) {
            this.handleError(error);
        }
    }
    
    // 에러 처리 (컴포넌트 격리)
    handleError(error) {
        console.error(`❌ [${this.constructor.name}] 에러:`, error);
        // 에러가 나도 다른 컴포넌트는 정상 작동
    }
    
    // 안전한 이벤트 리스너 추가
    safeAddEventListener(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        }
    }
    
    // 안전한 요소 선택
    safeQuerySelector(selector) {
        return this.element ? this.element.querySelector(selector) : null;
    }
    
    // 컴포넌트 삭제
    destroy() {
        // 이벤트 리스너 제거
        // 메모리 정리
        if (this.element) {
            this.element.innerHTML = '';
        }
    }
}

// 전역으로 사용 가능하게
window.Component = Component;