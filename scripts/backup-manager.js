const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const extract = require('extract-zip');
const readline = require('readline');

/**
 * 향상된 백업 관리 시스템
 */
class BackupManager {
    constructor() {
        this.backupDir = path.join(__dirname, '..', 'backups');
        this.metadataFile = path.join(this.backupDir, 'backup-metadata.json');
        this.ensureBackupDir();
    }
    
    /**
     * 백업 디렉토리 확인/생성
     */
    ensureBackupDir() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
        if (!fs.existsSync(this.metadataFile)) {
            fs.writeFileSync(this.metadataFile, JSON.stringify([], null, 2));
        }
    }
    
    /**
     * 백업 생성
     */
    async createBackup(description = '') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `backup_${timestamp}.zip`;
        const backupPath = path.join(this.backupDir, backupName);
        
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(backupPath);
            const archive = archiver('zip', { zlib: { level: 9 } });
            
            output.on('close', () => {
                // 메타데이터 업데이트
                this.updateMetadata({
                    id: Date.now(),
                    filename: backupName,
                    timestamp: new Date().toISOString(),
                    description: description || '수동 백업',
                    size: archive.pointer(),
                    files: this.countFiles('../src')
                });
                
                console.log(`✅ 백업 생성 완료: ${backupName}`);
                console.log(`   설명: ${description || '수동 백업'}`);
                console.log(`   크기: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
                resolve(backupName);
            });
            
            archive.on('error', reject);
            archive.pipe(output);
            
            // 백업할 디렉토리들
            archive.directory(path.join(__dirname, '..', 'src'), 'src');
            archive.directory(path.join(__dirname, '..', 'docs'), 'docs');
            archive.file(path.join(__dirname, '..', 'package.json'), { name: 'package.json' });
            archive.file(path.join(__dirname, '..', 'README.md'), { name: 'README.md' });            
            archive.finalize();
        });
    }
    
    /**
     * 백업 목록 조회
     */
    listBackups() {
        const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
        
        if (metadata.length === 0) {
            console.log('📭 백업이 없습니다.');
            return [];
        }
        
        console.log('\n📦 백업 목록:');
        console.log('─'.repeat(80));
        
        metadata.forEach((backup, index) => {
            const date = new Date(backup.timestamp);
            const dateStr = date.toLocaleString('ko-KR');
            const sizeStr = (backup.size / 1024 / 1024).toFixed(2) + ' MB';
            
            console.log(`${index + 1}. [${dateStr}] ${backup.description}`);
            console.log(`   파일명: ${backup.filename}`);
            console.log(`   크기: ${sizeStr} | 파일 수: ${backup.files}`);
            console.log('─'.repeat(80));
        });
        
        return metadata;
    }
    
    /**
     * 백업 복구
     */
    async restoreBackup(backupId) {
        const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
        const backup = metadata[backupId - 1];
        
        if (!backup) {
            console.error('❌ 유효하지 않은 백업 번호입니다.');
            return false;
        }
        
        const backupPath = path.join(this.backupDir, backup.filename);
        
        if (!fs.existsSync(backupPath)) {
            console.error('❌ 백업 파일을 찾을 수 없습니다.');
            return false;
        }
        
        console.log(`\n🔄 백업 복구 중: ${backup.description}`);
        console.log(`   날짜: ${new Date(backup.timestamp).toLocaleString('ko-KR')}`);
        
        // 현재 상태를 임시 백업
        console.log('📸 현재 상태를 임시 백업 중...');
        await this.createBackup('복구 전 자동 백업');
        
        // 기존 파일 삭제 (src 폴더만)
        const srcPath = path.join(__dirname, '..', 'src');
        if (fs.existsSync(srcPath)) {
            this.deleteFolderRecursive(srcPath);
        }
        
        // 백업 파일 압축 해제
        try {
            const extract = require('extract-zip');
            await extract(backupPath, { dir: path.join(__dirname, '..') });
            console.log('✅ 백업 복구 완료!');
            return true;
        } catch (error) {
            // extract-zip이 없는 경우 대체 방법
            console.log('📌 extract-zip 패키지가 필요합니다. 수동으로 압축을 해제하세요.');
            console.log(`   백업 파일: ${backupPath}`);
            return false;
        }
    }
    
    /**
     * 백업 비교
     */
    compareBackups(id1, id2) {
        const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
        const backup1 = metadata[id1 - 1];
        const backup2 = metadata[id2 - 1];
        
        if (!backup1 || !backup2) {
            console.error('❌ 유효하지 않은 백업 번호입니다.');
            return;
        }
        
        console.log('\n📊 백업 비교:');
        console.log('─'.repeat(80));
        console.log('백업 1:', backup1.description);
        console.log('날짜:', new Date(backup1.timestamp).toLocaleString('ko-KR'));        console.log('크기:', (backup1.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('');
        console.log('백업 2:', backup2.description);
        console.log('날짜:', new Date(backup2.timestamp).toLocaleString('ko-KR'));
        console.log('크기:', (backup2.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('─'.repeat(80));
        
        const timeDiff = new Date(backup2.timestamp) - new Date(backup1.timestamp);
        const hoursDiff = Math.abs(timeDiff / (1000 * 60 * 60));
        console.log(`\n시간 차이: ${hoursDiff.toFixed(1)}시간`);
    }
    
    /**
     * 메타데이터 업데이트
     */
    updateMetadata(backupInfo) {
        const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
        metadata.push(backupInfo);
        
        // 최대 50개까지만 유지
        if (metadata.length > 50) {
            const oldBackup = metadata.shift();
            const oldPath = path.join(this.backupDir, oldBackup.filename);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
                console.log(`🗑️ 오래된 백업 삭제: ${oldBackup.filename}`);
            }
        }
        
        fs.writeFileSync(this.metadataFile, JSON.stringify(metadata, null, 2));
    }
    
    /**
     * 폴더 재귀적 삭제
     */
    deleteFolderRecursive(folderPath) {
        if (fs.existsSync(folderPath)) {
            fs.readdirSync(folderPath).forEach((file) => {
                const curPath = path.join(folderPath, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    this.deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(folderPath);
        }
    }
    
    /**
     * 파일 개수 카운트
     */
    countFiles(dir) {
        let count = 0;
        const fullPath = path.join(__dirname, dir);
        
        if (!fs.existsSync(fullPath)) return 0;
        
        const files = fs.readdirSync(fullPath);
        files.forEach(file => {
            const filePath = path.join(fullPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                count += this.countFiles(path.join(dir, file));
            } else {
                count++;
            }
        });
        
        return count;
    }
}

/**
 * 인터랙티브 CLI
 */
async function interactiveMenu() {
    const manager = new BackupManager();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const question = (query) => new Promise(resolve => rl.question(query, resolve));
    
    console.log('\n🎯 백업 관리 시스템');
    console.log('═'.repeat(80));
    
    while (true) {
        console.log('\n메뉴를 선택하세요:');
        console.log('1. 새 백업 생성');
        console.log('2. 백업 목록 보기');
        console.log('3. 백업 복구');
        console.log('4. 백업 비교');
        console.log('5. 자동 백업 (현재 시간)');
        console.log('0. 종료');
        
        const choice = await question('\n선택> ');
        
        switch (choice) {
            case '1':
                const desc = await question('백업 설명 입력 (엔터: 기본): ');
                await manager.createBackup(desc);
                break;
                
            case '2':
                manager.listBackups();
                break;                
            case '3':
                const backups = manager.listBackups();
                if (backups.length > 0) {
                    const backupId = await question('\n복구할 백업 번호 선택: ');
                    const confirm = await question(`정말 복구하시겠습니까? (y/n): `);
                    if (confirm.toLowerCase() === 'y') {
                        await manager.restoreBackup(parseInt(backupId));
                    }
                }
                break;
                
            case '4':
                manager.listBackups();
                const id1 = await question('\n첫 번째 백업 번호: ');
                const id2 = await question('두 번째 백업 번호: ');
                manager.compareBackups(parseInt(id1), parseInt(id2));
                break;
                
            case '5':
                const now = new Date().toLocaleString('ko-KR');
                await manager.createBackup(`자동 백업 - ${now}`);
                break;
                
            case '0':
                console.log('👋 백업 관리를 종료합니다.');
                rl.close();
                process.exit(0);
                
            default:
                console.log('❌ 잘못된 선택입니다.');
        }
        
        await question('\n계속하려면 엔터를 누르세요...');
    }
}

// 스크립트 실행
if (require.main === module) {
    // 명령줄 인자 확인
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // 인터랙티브 모드
        interactiveMenu();
    } else {
        // 명령줄 모드
        const manager = new BackupManager();
        const command = args[0];
        
        switch (command) {
            case 'create':
                manager.createBackup(args[1] || '명령줄 백업').then(() => {
                    process.exit(0);
                });
                break;
                
            case 'list':
                manager.listBackups();
                process.exit(0);
                break;
                
            case 'restore':
                if (args[1]) {
                    manager.restoreBackup(parseInt(args[1])).then(() => {
                        process.exit(0);
                    });
                } else {
                    console.error('백업 번호를 지정하세요.');
                    process.exit(1);
                }
                break;
                
            default:
                console.log('사용법:');
                console.log('  node backup-manager.js           # 인터랙티브 모드');
                console.log('  node backup-manager.js create    # 백업 생성');
                console.log('  node backup-manager.js list      # 백업 목록');
                console.log('  node backup-manager.js restore N # N번 백업 복구');
                process.exit(0);
        }
    }
}

module.exports = BackupManager;