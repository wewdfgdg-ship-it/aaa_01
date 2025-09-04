// Configuration File
const config = {
    appName: 'Web Project Template',
    version: '1.0.0',
    apiUrl: 'http://localhost:3000/api',
    environment: 'development',
    debug: true,
    
    // 자동화 설정
    automation: {
        backupInterval: 30 * 60 * 1000, // 30분
        githubSyncInterval: 60 * 60 * 1000, // 1시간
        enabled: true
    },
    
    // 프로젝트 정보
    project: {
        name: 'AAA Project',
        author: 'Developer',
        created: '2025-01-16',
        github: 'https://github.com/wewdfgdg-ship-it/aaa_01'
    }
};

// 개발 모드 메시지
if (config.debug) {
    console.log('🚀 개발 모드 활성화');
    console.log('📦 자동 백업: 30분마다');
    console.log('🌐 GitHub 동기화: 1시간마다');
    console.log('💾 프로젝트:', config.project.name);
}

// 페이지 로드 완료시 실행
window.addEventListener('DOMContentLoaded', () => {
    console.log(`✅ ${config.appName} v${config.version} 로드 완료`);
});