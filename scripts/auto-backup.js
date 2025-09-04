const chokidar = require('chokidar');
const BackupManager = require('./backup-manager');
const path = require('path');
const fs = require('fs');

/**
 * 자동 백업 감시 시스템
 */
class AutoBackupWatcher {
    constructor() {
        this.manager = new BackupManager();
        this.lastBackupTime = 0;
        this.backupInterval = 30 * 60 * 1000; // 30분
        this.changeCount = 0;
        this.maxChangesBeforeBackup = 10; // 10개 파일 변경시 백업
        
        // 설정 파일 로드
        this.loadConfig();
    }
    
    loadConfig() {
        const configPath = path.join(__dirname, 'auto-backup-config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            this.backupInterval = config.interval || this.backupInterval;
            this.maxChangesBeforeBackup = config.maxChanges || this.maxChangesBeforeBackup;
        }
    }
    
    start() {
        console.log('🚀 자동 백업 시스템 시작');
        console.log(`📋 설정: ${this.backupInterval/60000}분마다 또는 ${this.maxChangesBeforeBackup}개 파일 변경시`);
        console.log('─'.repeat(80));
        
        // 감시할 경로
        const watchPath = path.join(__dirname, '..', 'src');
        
        // 파일 감시 시작
        const watcher = chokidar.watch(watchPath, {
            ignored: /(^|[\/\\])\../, // 숨김 파일 무시
            persistent: true,
            ignoreInitial: true
        });
        
        // 파일 변경 감지
        watcher
            .on('add', path => this.handleChange('추가', path))
            .on('change', path => this.handleChange('수정', path))
            .on('unlink', path => this.handleChange('삭제', path));
        
        // 정기 백업 타이머
        this.startIntervalBackup();
        
        // 종료 처리
        process.on('SIGINT', () => {
            console.log('\n\n🛑 자동 백업 시스템 종료 중...');
            this.createBackup('시스템 종료 전 최종 백업');
            setTimeout(() => process.exit(0), 2000);
        });
    }
    
    handleChange(type, filePath) {
        const fileName = path.basename(filePath);
        const time = new Date().toLocaleTimeString('ko-KR');
        
        console.log(`[${time}] 📝 ${type}: ${fileName}`);
        
        this.changeCount++;
        
        // 변경 횟수 도달시 백업
        if (this.changeCount >= this.maxChangesBeforeBackup) {
            this.createBackup(`${this.changeCount}개 파일 변경 후 자동 백업`);
            this.changeCount = 0;
        }
    }
    
    startIntervalBackup() {
        // 주기적 백업
        setInterval(() => {
            const now = Date.now();
            if (now - this.lastBackupTime >= this.backupInterval) {
                this.createBackup('정기 자동 백업');
            }
        }, 60000); // 1분마다 체크
    }
    
    async createBackup(description) {
        try {
            const time = new Date().toLocaleString('ko-KR');
            console.log(`\n⏳ [${time}] 백업 생성 중...`);
            
            await this.manager.createBackup(description);
            this.lastBackupTime = Date.now();
            
            console.log('─'.repeat(80));
        } catch (error) {
            console.error('❌ 백업 실패:', error.message);
        }
    }
    
    showStatus() {
        const lastBackup = this.lastBackupTime 
            ? new Date(this.lastBackupTime).toLocaleString('ko-KR')
            : '없음';
        
        console.log('\n📊 자동 백업 상태:');
        console.log(`  마지막 백업: ${lastBackup}`);
        console.log(`  변경된 파일: ${this.changeCount}개`);
        console.log(`  다음 백업: ${this.maxChangesBeforeBackup - this.changeCount}개 파일 변경 후`);
    }
}

// 스크립트 실행
if (require.main === module) {
    const watcher = new AutoBackupWatcher();
    
    console.log('\n🎯 자동 백업 모드 선택:');
    console.log('1. 실시간 감시 모드 (파일 변경 감지)');
    console.log('2. 한 번만 백업');
    console.log('0. 종료');
    
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('\n선택> ', (answer) => {
        switch(answer) {
            case '1':
                console.clear();
                watcher.start();
                
                // 상태 표시 (10초마다)
                setInterval(() => watcher.showStatus(), 10000);
                break;
                
            case '2':
                watcher.createBackup('수동 단일 백업').then(() => {
                    process.exit(0);
                });
                break;
                
            default:
                console.log('종료합니다.');
                process.exit(0);
        }
        rl.close();
    });
}

module.exports = AutoBackupWatcher;