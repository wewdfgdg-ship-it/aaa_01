const fs = require('fs');
const path = require('path');
const readline = require('readline');

// archiver와 extract-zip을 동적으로 로드
let archiver, extract;
try {
    archiver = require('archiver');
} catch (e) {
    console.log('⚠️ archiver 패키지가 없습니다. 설치하세요: npm install archiver');
}
try {
    extract = require('extract-zip');
} catch (e) {
    console.log('⚠️ extract-zip 패키지가 없습니다. 설치하세요: npm install extract-zip');
}

/**
 * 간단한 백업 시스템 (패키지 없이도 기본 동작)
 */
class SimpleBackupManager {
    constructor() {
        this.backupDir = path.join(__dirname, '..', 'backups');
        this.metadataFile = path.join(this.backupDir, 'backup-metadata.json');
        this.ensureBackupDir();
    }
    
    ensureBackupDir() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
        if (!fs.existsSync(this.metadataFile)) {
            fs.writeFileSync(this.metadataFile, JSON.stringify([], null, 2));
        }
    }