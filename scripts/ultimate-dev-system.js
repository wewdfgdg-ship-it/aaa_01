const { spawn } = require('child_process');
const BackupManager = require('./backup-manager');
const GitAutoSync = require('./git-auto-sync');
const path = require('path');

/**
 * 개발 서버 + 자동 백업 + GitHub 자동 동기화 통합
 */
class UltimateDevSystem {
    constructor() {
        this.backupManager = new BackupManager();
        this.gitSync = new GitAutoSync();
        this.processes = [];
    }
    
    async start() {
        console.clear();
        console.log('╔════════════════════════════════════════╗');
        console.log('║   🚀 Ultimate Development System 🚀    ║');
        console.log('╠════════════════════════════════════════╣');
        console.log('║  ✅ 로컬 백업 (30분마다)              ║');
        console.log('║  ✅ GitHub 동기화 (1시간마다)         ║');
        console.log('║  ✅ 개발 서버                         ║');
        console.log('║  ✅ 실시간 파일 감시                  ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('');
        
        // 1. 초기 백업
        console.log('📦 초기 백업 생성...');
        await this.backupManager.createBackup('개발 시작 - 초기 백업');
        
        // 2. 초기 GitHub 동기화
        console.log('🔄 GitHub 동기화...');
        await this.gitSync.syncToGitHub('개발 시작 - 초기 동기화');
        
        // 3. 자동 백업 시작 (백그라운드)
        console.log('💾 자동 백업 시스템 활성화...');
        const autoBackup = spawn('node', [
            path.join(__dirname, 'auto-backup-minimal.js')
        ], {
            detached: false,
            stdio: 'ignore'
        });
        this.processes.push(autoBackup);
        
        // 4. GitHub 자동 동기화 (백그라운드)
        console.log('🌐 GitHub 자동 동기화 활성화...');
        const gitAutoSync = spawn('node', [
            path.join(__dirname, 'git-sync-minimal.js')
        ], {
            detached: false,
            stdio: 'ignore'
        });
        this.processes.push(gitAutoSync);
        
        // 5. 개발 서버 시작
        console.log('🌍 개발 서버 시작...\n');
        console.log('═'.repeat(50));
        console.log('📍 서버: http://localhost:8080');
        console.log('💾 백업: 30분마다 자동');
        console.log('🌐 GitHub: 1시간마다 자동');
        console.log('🛑 종료: Ctrl+C');
        console.log('═'.repeat(50));
        console.log('\n');
        
        const server = spawn('npx', ['live-server', path.join(__dirname, '..', 'src')], {
            stdio: 'inherit',
            shell: true
        });
        this.processes.push(server);
        
        // 상태 표시 (10분마다)
        this.statusInterval = setInterval(() => {
            this.showStatus();
        }, 10 * 60 * 1000);
        
        // 종료 처리
        process.on('SIGINT', async () => {
            await this.shutdown();
        });
        
        server.on('error', (err) => {
            console.error('❌ 서버 오류:', err);
            this.shutdown();
        });
    }
    
    showStatus() {
        const time = new Date().toLocaleTimeString('ko-KR');
        console.log(`\n[${time}] 📊 시스템 상태:`);
        console.log('  💾 백업: 활성');
        console.log('  🌐 GitHub: 활성');
        console.log('  🌍 서버: 실행 중\n');
    }
    
    async shutdown() {
        console.log('\n\n🛑 시스템 종료 중...');
        
        clearInterval(this.statusInterval);
        
        // 최종 백업
        console.log('📦 최종 백업 생성...');
        await this.backupManager.createBackup('개발 종료 - 최종 백업');
        
        // 최종 GitHub 동기화
        console.log('🔄 최종 GitHub 동기화...');
        await this.gitSync.syncToGitHub('개발 종료 - 최종 동기화');
        
        // 모든 프로세스 종료
        this.processes.forEach(p => {
            try {
                p.kill();
            } catch (e) {}
        });
        
        console.log('✅ 모든 작업 완료! 안전하게 종료되었습니다.');
        process.exit(0);
    }
}

// 실행
if (require.main === module) {
    const system = new UltimateDevSystem();
    system.start().catch(error => {
        console.error('❌ 시스템 시작 실패:', error);
        process.exit(1);
    });
}

module.exports = UltimateDevSystem;