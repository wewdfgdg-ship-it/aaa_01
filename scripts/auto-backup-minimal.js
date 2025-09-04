const fs = require('fs');
const path = require('path');
const BackupManager = require('./backup-manager');

/**
 * 백그라운드 자동 백업 (최소 버전)
 */
class MinimalAutoBackup {
    constructor() {
        this.manager = new BackupManager();
        this.lastModified = {};
        this.changeCount = 0;
        this.lastBackupTime = Date.now();
    }
    
    start() {
        // 30분마다 백업
        setInterval(() => {
            this.createBackup('정기 자동 백업 (30분)');
        }, 30 * 60 * 1000);
        
        // 파일 변경 감시 (간단 버전)
        this.watchFiles();
    }
    
    watchFiles() {
        const srcPath = path.join(__dirname, '..', 'src');
        
        setInterval(() => {
            this.checkDirectory(srcPath);
            
            // 10개 이상 변경시 백업
            if (this.changeCount >= 10) {
                this.createBackup(`${this.changeCount}개 파일 변경 - 자동 백업`);
                this.changeCount = 0;
            }
        }, 5000); // 5초마다 체크
    }
    
    checkDirectory(dir) {
        if (!fs.existsSync(dir)) return;
        
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !file.startsWith('.')) {
                this.checkDirectory(fullPath);
            } else if (stat.isFile()) {
                const mtime = stat.mtime.getTime();
                
                if (this.lastModified[fullPath] && this.lastModified[fullPath] < mtime) {
                    this.changeCount++;
                }
                
                this.lastModified[fullPath] = mtime;
            }
        });
    }
    
    async createBackup(description) {
        try {
            await this.manager.createBackup(description);
            this.lastBackupTime = Date.now();
            
            // 로그 파일에 기록
            const logPath = path.join(__dirname, '..', 'backups', 'auto-backup.log');
            const logEntry = `[${new Date().toISOString()}] ${description}\n`;
            fs.appendFileSync(logPath, logEntry);
        } catch (error) {
            // 조용히 실패 (백그라운드이므로)
        }
    }
}

// 백그라운드 실행
const backup = new MinimalAutoBackup();
backup.start();

// 프로세스 유지
process.stdin.resume();