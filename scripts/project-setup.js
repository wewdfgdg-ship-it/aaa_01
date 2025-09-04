const fs = require('fs');
const path = require('path');

/**
 * 프로젝트 초기 설정 스크립트
 */
class ProjectSetup {
    constructor(projectName) {
        this.projectName = projectName || 'my-project';
        this.rootPath = process.cwd();
    }
    
    /**
     * 폴더 구조 생성
     */
    createStructure() {
        const folders = [
            'src/components',
            'src/pages',
            'src/shared/styles',
            'src/shared/scripts',
            'src/assets/images',
            'src/assets/fonts',
            'src/assets/icons',
            'docs',
            'backups',
            'tests',
            'scripts'
        ];
        
        console.log('📁 폴더 구조 생성 중...');
        
        folders.forEach(folder => {
            const folderPath = path.join(this.rootPath, folder);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                console.log(`  ✅ ${folder}`);
            } else {
                console.log(`  ⏭️ ${folder} (이미 존재)`);
            }
        });
    }
    
    /**
     * 기본 파일 생성
     */
    createBaseFiles() {
        console.log('📄 기본 파일 생성 중...');
        
        // index.html
        const indexHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.projectName}</title>
    <link rel="stylesheet" href="shared/styles/reset.css">
    <link rel="stylesheet" href="shared/styles/common.css">
</head>
<body>
    <h1>Welcome to ${this.projectName}</h1>    <script src="shared/scripts/config.js"></script>
    <script src="shared/scripts/utils.js"></script>
</body>
</html>`;
        
        this.writeFile('src/index.html', indexHtml);
        
        // reset.css
        const resetCss = `/* Reset CSS */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
}

a {
    text-decoration: none;
    color: inherit;
}

ul, ol {
    list-style: none;
}`;
        
        this.writeFile('src/shared/styles/reset.css', resetCss);
        
        // variables.css
        const variablesCss = `/* CSS Variables */
:root {
    /* Colors */
    --color-primary: #007bff;
    --color-secondary: #6c757d;
    --color-success: #28a745;
    --color-danger: #dc3545;
    --color-warning: #ffc107;
    --color-info: #17a2b8;
    
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    
    /* Breakpoints */
    --breakpoint-mobile: 768px;
    --breakpoint-tablet: 1024px;
    --breakpoint-desktop: 1440px;
}`;
        
        this.writeFile('src/shared/styles/variables.css', variablesCss);
        
        // common.css
        const commonCss = `/* Common Styles */@import './variables.css';
@import './reset.css';

body {
    background-color: #f8f9fa;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}`;
        
        this.writeFile('src/shared/styles/common.css', commonCss);
        
        // config.js
        const configJs = `// Configuration
const config = {
    appName: '${this.projectName}',
    version: '1.0.0',
    apiUrl: 'http://localhost:3000',
    debug: true
};`;
        
        this.writeFile('src/shared/scripts/config.js', configJs);
        
        // utils.js
        const utilsJs = `// Utility Functions

/**
 * 날짜 포맷팅
 * @param {Date} date 
 * @returns {string}
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('ko-KR').format(date);
}

/**
 * 디바운스 함수
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}`;
        
        this.writeFile('src/shared/scripts/utils.js', utilsJs);
    }
    
    /**
     * 파일 쓰기 헬퍼
     */
    writeFile(filePath, content) {
        const fullPath = path.join(this.rootPath, filePath);
        const dir = path.dirname(fullPath);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        if (!fs.existsSync(fullPath)) {
            fs.writeFileSync(fullPath, content);
            console.log(`  ✅ ${filePath}`);
        } else {
            console.log(`  ⏭️ ${filePath} (이미 존재)`);
        }
    }
    
    /**
     * Git 초기화
     */
    initGit() {
        console.log('🔧 Git 초기화 중...');
        
        const { execSync } = require('child_process');
        
        try {
            execSync('git init', { cwd: this.rootPath });
            console.log('  ✅ Git 저장소 초기화 완료');
        } catch (error) {            console.log('  ⚠️ Git 초기화 실패:', error.message);
        }
    }
    
    /**
     * 실행
     */
    setup() {
        console.log(`\n🚀 "${this.projectName}" 프로젝트 설정 시작...\n`);
        
        this.createStructure();
        this.createBaseFiles();
        this.initGit();
        
        console.log(`\n✅ 프로젝트 설정 완료!`);
        console.log(`\n📌 다음 단계:`);
        console.log(`  1. npm install (의존성 설치)`);
        console.log(`  2. npm run dev (개발 서버 시작)`);
        console.log(`  3. docs/RULES.md 확인 (개발 규칙)`);
    }
}

// 스크립트 실행
const projectName = process.argv[2] || 'my-project';
new ProjectSetup(projectName).setup();