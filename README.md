# 프로젝트 템플릿

## 📋 소개
표준화된 웹 개발 프로젝트 템플릿입니다.

## 🚀 시작하기

### 필수 조건
- Node.js v16.0.0 이상
- Git

### 설치
```bash
# 의존성 설치
npm install

# extract-zip 설치 (백업 복구용)
npm install extract-zip --save-dev

# 개발 서버 실행 (자동 백업 포함)
npm run dev

# 백업 관리 시스템
npm run backup

# 테스트 실행
npm test

# 빌드
npm run build
```

## 📁 프로젝트 구조
```
project/
├── src/
│   ├── components/     # 재사용 컴포넌트
│   ├── pages/         # 페이지별 파일
│   ├── shared/        # 공통 리소스
│   └── assets/        # 정적 파일
├── docs/              # 문서
├── backups/           # 백업 파일
├── tests/             # 테스트 파일
└── scripts/           # 유틸리티 스크립트
```

## 💾 백업 시스템

이 프로젝트는 **타임머신 방식의 백업 시스템**을 내장하고 있습니다.

### 주요 기능
- ✅ **자동 백업**: 개발 서버 시작시 자동 생성
- ✅ **백업 복구**: 원하는 시점으로 즉시 복구
- ✅ **백업 관리**: 최대 50개 백업 자동 관리
- ✅ **안전장치**: 복구 전 현재 상태 자동 백업

### 빠른 사용법
```bash
# 인터랙티브 백업 관리
npm run backup

# 백업 생성
npm run backup:create

# 백업 목록
npm run backup:list

# 백업 복구
npm run backup:restore [번호]
```

자세한 내용은 [docs/BACKUP_GUIDE.md](docs/BACKUP_GUIDE.md)를 참고하세요.

## 📐 개발 규칙
자세한 개발 규칙은 [docs/RULES.md](docs/RULES.md)를 참고하세요.

### 주요 규칙
- Git 커밋 컨벤션 준수
- 코드 스타일 가이드 준수
- 테스트 작성 필수
- 문서화 필수

## 🛠 스크립트

### 백업
```bash
npm run backup
```

### 프로젝트 설정
```bash
node scripts/project-setup.js
```

## 📝 변경 로그
[docs/CHANGELOG.md](docs/CHANGELOG.md)를 참고하세요.

## 📞 연락처
- 이메일: your-email@example.com
- GitHub: https://github.com/yourusername

## 📄 라이센스
MIT License