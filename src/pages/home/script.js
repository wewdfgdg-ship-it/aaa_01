/**
 * Home Page JavaScript
 */

// 헤더 컴포넌트 로드
async function loadHeader() {
    try {
        const response = await fetch('../../components/Header/index.html');
        const html = await response.text();
        document.getElementById('header-container').innerHTML = html;
    } catch (error) {
        console.error('헤더 로드 실패:', error);
    }
}

// 페이지 초기화
function initHomePage() {
    console.log('홈 페이지 초기화');
    
    // 시작하기 버튼 이벤트
    const startBtn = document.querySelector('.btn-primary');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            alert('프로젝트를 시작합니다!');
            // 실제로는 다른 페이지로 이동하거나 모달을 띄우는 등의 동작
        });
    }
    
    // Feature 카드 애니메이션
    observeFeatures();
}

// Feature 카드 스크롤 애니메이션
function observeFeatures() {
    const features = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(20px)';
        feature.style.transition = 'all 0.5s ease';
        observer.observe(feature);
    });
}

// DOM 로드 완료시 실행
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    initHomePage();
});