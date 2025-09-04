const { spawn } = require('child_process');
const BackupManager = require('./backup-manager');
const path = require('path');

/**
 * 개발 서버 + 자동 백업 통합 실행
 */
async function startDevWithBackup() {
    console.log('🚀 개발 환경 시작 중...\n');
    
    // 1. 시작 백업 생성
    const manager = new BackupManager();
    console.log('📦 시작 전 백업 생성...');
    await manager.createBackup('개발 서버 시작 - 자동 백업');
    
    // 2. 자동 백업 시스템 실행 (백그라운드)
    console.log('\n🔄 자동 백업 시스템 활성화...');
    const autoBackup = spawn('node', [path.join(__dirname, 'auto-backup-minimal.js')], {
        detached: false,
        stdio: 'ignore'
    });
    
    // 3. 개발 서버 실행
    console.log('🌐 개발 서버 시작...\n');
    console.log('─'.repeat(80));
    console.log('📌 서버 주소: http://localhost:3000');
    console.log('📌 자동 백업: 30분마다 또는 10개 파일 변경시');
    console.log('📌 종료: Ctrl+C');
    console.log('─'.repeat(80));
    console.log('\n');
    
    const server = spawn('npx', ['live-server', '--config=.live-server.json'], {
        stdio: 'inherit',
        shell: true,
        cwd: path.join(__dirname, '..')
    });
    
    // 종료 처리
    process.on('SIGINT', async () => {
        console.log('\n\n🛑 개발 환경 종료 중...');
        
        // 최종 백업
        console.log('📦 종료 전 최종 백업...');
        await manager.createBackup('개발 서버 종료 - 최종 백업');
        
        // 프로세스 종료
        server.kill();
        autoBackup.kill();
        
        console.log('✅ 안전하게 종료되었습니다.');
        process.exit(0);
    });
    
    server.on('error', (err) => {
        console.error('❌ 서버 실행 오류:', err);
        autoBackup.kill();
        process.exit(1);
    });
}

// 실행
startDevWithBackup().catch(error => {
    console.error('❌ 실행 실패:', error);
    process.exit(1);
});