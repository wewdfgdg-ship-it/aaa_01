const BackupManager = require('./backup-manager');

/**
 * 초기 백업 생성 스크립트
 */
async function createInitialBackup() {
    console.log('🚀 초기 백업 생성 중...\n');
    
    const manager = new BackupManager();
    
    // 초기 프로젝트 백업
    await manager.createBackup('초기 프로젝트 설정 - 클린 상태');
    
    console.log('\n✅ 초기 백업 생성 완료!');
    console.log('📌 이제 안심하고 개발을 시작하세요.');
    console.log('💡 언제든 "npm run backup"으로 백업 관리 가능합니다.\n');
}

// 스크립트 실행
createInitialBackup().catch(error => {
    console.error('❌ 초기 백업 생성 실패:', error);
    process.exit(1);
});