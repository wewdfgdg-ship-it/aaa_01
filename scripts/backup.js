const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * 프로젝트 백업 생성 스크립트
 */
function createBackup() {
    const date = new Date().toISOString().slice(0, 10);
    const time = new Date().toTimeString().slice(0, 8).replace(/:/g, '-');
    const backupName = `backup_${date}_${time}.zip`;
    const backupDir = path.join(__dirname, '..', 'backups');
    
    // 백업 디렉토리가 없으면 생성
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const output = fs.createWriteStream(
        path.join(backupDir, backupName)
    );
    
    const archive = archiver('zip', {
        zlib: { level: 9 } // 최대 압축
    });
    
    output.on('close', () => {
        console.log(`✅ 백업 생성 완료: ${backupName}`);
        console.log(`   크기: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    });
    
    output.on('error', (err) => {
        console.error('❌ 백업 생성 실패:', err);
    });
    
    archive.on('error', (err) => {
        throw err;
    });
    
    // 파이프 설정
    archive.pipe(output);
    
    // src 디렉토리 추가
    archive.directory(path.join(__dirname, '..', 'src'), 'src');
    
    // docs 디렉토리 추가
    archive.directory(path.join(__dirname, '..', 'docs'), 'docs');
    
    // 루트 파일들 추가
    archive.file(path.join(__dirname, '..', 'package.json'), { name: 'package.json' });
    archive.file(path.join(__dirname, '..', 'README.md'), { name: 'README.md' });
    
    // 압축 완료
    archive.finalize();
    
    // 오래된 백업 삭제 (30일 이상)
    cleanOldBackups(backupDir);
}

/**
 * 30일 이상된 백업 파일 삭제
 */
function cleanOldBackups(backupDir) {
    const files = fs.readdirSync(backupDir);
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    
    files.forEach(file => {
        if (file.endsWith('.zip')) {
            const filePath = path.join(backupDir, file);
            const stats = fs.statSync(filePath);
            
            if (now - stats.mtimeMs > thirtyDays) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ 오래된 백업 삭제: ${file}`);
            }
        }
    });
}

// 스크립트 실행
createBackup();