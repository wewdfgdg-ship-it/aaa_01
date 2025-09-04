const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * GitHub 자동 동기화 시스템
 */
class GitAutoSync {
    constructor() {
        this.sourceDir = 'C:\\Users\\Desktop\\aaa';
        this.gitDir = 'C:\\Users\\Desktop\\aaa_local';
        this.lastSyncTime = Date.now();
        this.changeCount = 0;
        this.syncInterval = 60 * 60 * 1000; // 1시간
        this.maxChangesBeforeSync = 20; // 20개 파일 변경시 동기화
        
        this.loadConfig();
    }
    
    loadConfig() {
        const configPath = path.join(__dirname, 'git-sync-config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            this.syncInterval = config.syncInterval || this.syncInterval;
            this.maxChangesBeforeSync = config.maxChanges || this.maxChangesBeforeSync;
        }
    }
    
    async start() {
        console.log('🚀 GitHub 자동 동기화 시스템 시작');
        console.log(`📋 설정: ${this.syncInterval/60000}분마다 또는 ${this.maxChangesBeforeSync}개 파일 변경시`);
        console.log('─'.repeat(80));
        
        // 초기 동기화
        await this.syncToGitHub('시스템 시작 - 초기 동기화');
        
        // 파일 감시
        this.watchFiles();
        
        // 정기 동기화
        this.startIntervalSync();
    }
    
    watchFiles() {
        const watchPath = path.join(this.sourceDir, 'src');
        
        // 간단한 파일 감시 (5초마다 체크)
        setInterval(() => {
            this.checkForChanges(watchPath);
            
            // 변경 횟수 도달시 동기화
            if (this.changeCount >= this.maxChangesBeforeSync) {
                this.syncToGitHub(`${this.changeCount}개 파일 변경 - 자동 동기화`);
                this.changeCount = 0;
            }
        }, 5000);
    }
    
    checkForChanges(dir) {
        if (!fs.existsSync(dir)) return;
        
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !file.startsWith('.')) {
                this.checkForChanges(fullPath);
            } else if (stat.isFile()) {
                // 변경 감지 로직 (간단 버전)
                const mtime = stat.mtime.getTime();
                if (mtime > this.lastSyncTime) {
                    this.changeCount++;
                }
            }
        });
    }
    
    startIntervalSync() {
        // 정기 동기화
        setInterval(() => {
            const now = Date.now();
            if (now - this.lastSyncTime >= this.syncInterval) {
                this.syncToGitHub('정기 자동 동기화');
            }
        }, 60000); // 1분마다 체크
    }
    
    async syncToGitHub(message) {
        const time = new Date().toLocaleString('ko-KR');
        console.log(`\n⏳ [${time}] GitHub 동기화 시작...`);
        console.log(`   설명: ${message}`);
        
        try {
            // 1. 파일 복사 (aaa → aaa_local)
            await this.copyFiles();
            
            // 2. Git 작업
            process.chdir(this.gitDir);
            
            // Git 상태 확인
            const status = await execPromise('git status --short');
            if (status.stdout.trim() === '') {
                console.log('   ℹ️ 변경사항 없음');
                return;
            }
            
            // Add, Commit, Push
            await execPromise('git add .');
            await execPromise(`git commit -m "${message} - ${time}"`);
            await execPromise('git push origin master');
            
            this.lastSyncTime = Date.now();
            
            console.log('   ✅ GitHub 푸시 완료!');
            console.log('   📍 https://github.com/wewdfgdg-ship-it/aaa_01');
            console.log('─'.repeat(80));
            
            // 로그 기록
            this.logSync(message);
            
        } catch (error) {
            console.error('   ❌ 동기화 실패:', error.message);
        }
    }
    
    async copyFiles() {
        const items = ['src', 'docs', 'scripts'];
        const files = ['README.md', 'package.json', '.gitignore'];
        
        // 폴더 복사
        for (const item of items) {
            const src = path.join(this.sourceDir, item);
            const dest = path.join(this.gitDir, item);            
            if (fs.existsSync(src)) {
                await execPromise(`xcopy /E /Y /Q "${src}" "${dest}\\" 2>nul`);
            }
        }
        
        // 파일 복사
        for (const file of files) {
            const src = path.join(this.sourceDir, file);
            const dest = path.join(this.gitDir, file);
            
            if (fs.existsSync(src)) {
                fs.copyFileSync(src, dest);
            }
        }
    }
    
    logSync(message) {
        const logPath = path.join(this.sourceDir, 'backups', 'git-sync.log');
        const logEntry = `[${new Date().toISOString()}] ${message}\n`;
        
        if (!fs.existsSync(path.dirname(logPath))) {
            fs.mkdirSync(path.dirname(logPath), { recursive: true });
        }
        
        fs.appendFileSync(logPath, logEntry);
    }
}

// 실행
if (require.main === module) {
    const sync = new GitAutoSync();
    
    console.log('🎯 GitHub 자동 동기화 모드:');
    console.log('1. 자동 모드 (파일 감시 + 정기 동기화)');
    console.log('2. 즉시 동기화 (1회)');
    console.log('0. 종료');
    
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('\n선택> ', async (answer) => {
        switch(answer) {
            case '1':
                console.clear();
                await sync.start();
                
                // 종료 처리
                process.on('SIGINT', async () => {
                    console.log('\n\n🛑 종료 중...');
                    await sync.syncToGitHub('시스템 종료 - 최종 동기화');
                    process.exit(0);
                });
                break;
                
            case '2':
                await sync.syncToGitHub('수동 즉시 동기화');
                process.exit(0);
                break;
                
            default:
                console.log('종료합니다.');
                process.exit(0);
        }
        rl.close();
    });
}

module.exports = GitAutoSync;