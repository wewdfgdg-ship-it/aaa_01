# 📋 프로젝트 개발 규칙서 (Project Development Rules)

## 1. 프로젝트 시작 체크리스트

### 초기 설정 (필수)
- [ ] Git 저장소 생성
- [ ] 프로젝트 구조 템플릿 적용
- [ ] README.md 작성
- [ ] .gitignore 설정
- [ ] 개발 환경 설정 문서화

## 2. 명명 규칙 (Naming Convention)

### 파일명 규칙
- 컴포넌트: PascalCase (예: HeaderNav/)
- 페이지: kebab-case (예: home-page/)
- 유틸리티: camelCase (예: formatDate.js)
- 스타일: kebab-case (예: main-layout.css)

### 코드 내부 규칙
- 클래스: PascalCase (예: class UserProfile {})
- 함수: camelCase (예: function getUserData() {})
- 상수: UPPER_SNAKE_CASE (예: const MAX_RETRY = 3)
- 변수: camelCase (예: let userAge = 25)

### CSS 클래스 규칙
- 일반: kebab-case (예: .header-nav {})
- 컴포넌트: btn-[modifier] (예: .btn-primary {})
- 상태: is-[state] (예: .is-active {})
- 보유: has-[property] (예: .has-error {})

## 3. Git 커밋 규칙

### 커밋 메시지 형식
```
[타입] 제목 (최대 50자)

본문 (선택사항, 무엇을 왜 변경했는지)
```

### 타입 종류
- feat: 새로운 기능 추가
- fix: 버그 수정
- style: 코드 포맷팅, 세미콜론 누락 등
- refactor: 코드 리팩토링
- test: 테스트 코드 추가
- docs: 문서 수정
- chore: 빌드 업무, 패키지 매니저 설정 등

### 예시
- git commit -m "feat: 로그인 폼 유효성 검사 추가"
- git commit -m "fix: 헤더 메뉴 반응형 오류 수정"
- git commit -m "style: 들여쓰기 통일 및 공백 제거"

## 4. 코드 작성 규칙

### 함수 작성 규칙
1. 모든 함수는 JSDoc 주석 필수
2. 입력값 검증 우선
3. 매직 넘버 금지
4. 객체는 명확한 구조로
5. 에러 처리 필수

## 5. CSS 작성 규칙

### CSS 파일 구조
1. 파일 최상단에 목차
2. CSS 변수 활용
3. 컴포넌트 단위 작성
4. 반응형은 모바일 우선

## 6. 파일 분할 규칙

- 한 파일당 하나의 책임만
- 기능별 분리 (API, 검증, UI)
- 재사용 가능한 모듈 작성

## 7. 백업 및 버전 관리 규칙

### 일일 백업 규칙
1. 매일 작업 종료 전 커밋
2. 주요 기능 완성시 태그 생성
3. 주 1회 원격 저장소 푸시

## 8. 테스트 규칙

- 주요 함수는 테스트 필수
- 배포 전 체크리스트 확인
- 크로스 브라우저 테스트

## 9. 작업 플로우

1. Issue 생성
2. Branch 생성
3. 개발
4. 테스트
5. PR 생성
6. 코드 리뷰
7. Merge

## 10. 금지 사항

- [ ] console.log 를 production에 남기지 않기
- [ ] 하드코딩된 API 키 커밋하지 않기
- [ ] node_modules 폴더 커밋하지 않기
- [ ] 테스트 없이 배포하지 않기

## 11. 필수 사항

- [ ] README 업데이트
- [ ] 변경 로그 작성
- [ ] 코드 리뷰 받기
- [ ] 테스트 코드 작성

## 12. 개발 환경

- Node.js: v16.0.0 이상
- 에디터: VSCode
- 브라우저: Chrome (개발), Firefox, Safari (테스트)

## 13. 코드 스타일

- 들여쓰기: 스페이스 2칸
- 세미콜론: 필수
- 따옴표: 작은따옴표 사용
- 줄 길이: 최대 80자