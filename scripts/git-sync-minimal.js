const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * 백그라운드 GitHub 자동 동기화 (최소 버전)
 */
class MinimalGitSync {
    constructor() {
        this.sourceDir = 'C:\\Users\\Desktop\\aaa';
        this.gitDir = 'C:\\Users\\Desktop\\aaa_local';
        this.lastSyncTime = Date.now();
        this.changeCount = 0;
    }
    
    async start() {
        // 1시간마다 동기화
        setInterval(async () => {
            await this.sync('정기 자동 GitHub 동기화');
        }, 60 * 60 * 1000);
        
        // 파일 변경 감시 (간단 버전)
        this.watchFiles();
    }
    
    watchFiles() {
        setInterval(() => {
            this.checkChanges();
            
            // 20개 이상 변경시 동기화
            if (this.changeCount >= 20) {
                this.sync(`${this.changeCount}개 파일 변경 - 자동 GitHub 동기화`);
                this.changeCount = 0;
            }
        }, 30000); // 30초마다 체크
    }
    
    checkChanges() {
        const srcPath = path.join(this.sourceDir, 'src');
        if (!fs.existsSync(srcPath)) return;
        
        // 간단한 변경 감지
        const checkDir = (dir) => {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);                
                if (stat.isDirectory() && !file.startsWith('.')) {
                    checkDir(fullPath);
                } else if (stat.isFile()) {
                    if (stat.mtime.getTime() > this.lastSyncTime) {
                        this.changeCount++;
                    }
                }
            });
        };
        
        checkDir(srcPath);
    }
    
    async sync(message) {
        try {
            // 파일 복사
            await this.copyFiles();
            
            // Git 작업
            process.chdir(this.gitDir);
            
            // 변경사항 확인
            const status = await execPromise('git status --short');
            if (status.stdout.trim() === '') {
                return; // 변경사항 없음
            }
            
            // Commit & Push
            const time = new Date().toLocaleString('ko-KR');
            await execPromise('git add .');
            await execPromise(`git commit -m "${message} - ${time}"`);
            await execPromise('git push origin master');
            
            this.lastSyncTime = Date.now();
            
            // 로그 기록
            const logPath = path.join(this.sourceDir, 'backups', 'git-sync.log');
            const logEntry = `[${new Date().toISOString()}] ${message}\n`;
            fs.appendFileSync(logPath, logEntry);
            
        } catch (error) {
            // 조용히 실패 (백그라운드이므로)
        }
    }
    
    async copyFiles() {
        const items = ['src', 'docs', 'scripts'];
        const files = ['README.md', 'package.json', '.gitignore'];
        
        // xcopy로 폴더 복사
        for (const item of items) {
            const src = path.join(this.sourceDir, item);
            const dest = path.join(this.gitDir, item);
            if (fs.existsSync(src)) {
                await execPromise(`xcopy /E /Y /Q "${src}" "${dest}\\" 2>nul`).catch(() => {});
            }
        }
        
        // 파일 복사
        for (const file of files) {
            const src = path.join(this.sourceDir, file);
            const dest = path.join(this.gitDir, file);
            if (fs.existsSync(src)) {
                try {
                    fs.copyFileSync(src, dest);
                } catch (e) {}
            }
        }
    }
}

// 백그라운드 실행
const sync = new MinimalGitSync();
sync.start();

// 프로세스 유지
process.stdin.resume();