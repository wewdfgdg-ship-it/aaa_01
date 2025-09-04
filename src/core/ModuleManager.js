/**
 * 🛡️ 모듈 관리 시스템 (Module Manager)
 * 
 * 각 모듈을 독립적으로 관리
 * 하나가 실패해도 나머지는 정상 작동
 */
class ModuleManager {
    constructor() {
        this.modules = {};
        this.loaded = {};
        this.failed = {};
    }
    
    /**
     * 모듈 등록 (안전하게)
     * @param {string} name - 모듈 이름
     * @param {Function} moduleClass - 모듈 클래스
     * @param {string} selector - CSS 선택자
     * @param {Object} options - 옵션
     */
    register(name, moduleClass, selector, options = {}) {
        try {
            // 이미 등록되어 있으면 스킵
            if (this.modules[name]) {
                console.log(`ℹ️ ${name} 모듈은 이미 등록됨`);
                return;
            }
            
            // 모듈 생성 시도
            const module = new moduleClass(selector, options);
            
            // 성공적으로 생성되면 저장
            this.modules[name] = module;
            this.loaded[name] = true;
            
            console.log(`✅ ${name} 모듈 로드 성공`);
            
        } catch (error) {
            // 실패해도 다른 모듈에 영향 없음
            this.failed[name] = error;
            console.error(`❌ ${name} 모듈 로드 실패:`, error.message);
        }
    }
    
    /**
     * 모듈 가져오기
     * @param {string} name 
     * @returns {Object|null}
     */
    get(name) {
        return this.modules[name] || null;
    }
    
    /**
     * 모듈 제거
     * @param {string} name 
     */
    unregister(name) {
        if (this.modules[name]) {
            // destroy 메소드가 있으면 실행
            if (typeof this.modules[name].destroy === 'function') {
                this.modules[name].destroy();
            }
            delete this.modules[name];
            delete this.loaded[name];
            console.log(`🗑️ ${name} 모듈 제거됨`);
        }
    }
    
    /**
     * 모든 모듈 상태 확인
     */
    status() {
        console.group('📊 모듈 상태');
        console.log('✅ 로드된 모듈:', Object.keys(this.loaded));
        console.log('❌ 실패한 모듈:', Object.keys(this.failed));
        console.groupEnd();
    }
    
    /**
     * 모듈 재시작
     * @param {string} name 
     */
    restart(name) {
        this.unregister(name);
        // 재등록은 수동으로 해야 함
        console.log(`ℹ️ ${name} 모듈을 재시작하려면 다시 register 하세요`);
    }
}

// 전역 모듈 매니저 생성
window.ModuleManager = new ModuleManager();