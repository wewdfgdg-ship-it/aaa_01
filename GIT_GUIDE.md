# GitHub 연결 및 업로드 가이드

## 🎯 현재 상태
- **로컬 저장소**: C:\Users\Desktop\aaa_local
- **원격 저장소**: https://github.com/wewdfgdg-ship-it/aaa_01.git
- **연결 상태**: ✅ 이미 연결됨

## 📤 프로젝트 업로드 방법

### 방법 1: 자동 스크립트 실행 (추천)

**PowerShell에서:**
```powershell
cd C:\Users\Desktop\aaa_local
.\git-upload.ps1
```

### 방법 2: 수동으로 진행

```powershell
# 1. aaa_local 폴더로 이동
cd C:\Users\Desktop\aaa_local

# 2. 프로젝트 파일 복사 (aaa → aaa_local)
# PowerShell에서 실행
Copy-Item -Path "C:\Users\Desktop\aaa\src" -Destination "." -Recurse -Force
Copy-Item -Path "C:\Users\Desktop\aaa\docs" -Destination "." -Recurse -Force
Copy-Item -Path "C:\Users\Desktop\aaa\scripts" -Destination "." -Recurse -Force
Copy-Item -Path "C:\Users\Desktop\aaa\tests" -Destination "." -Recurse -Force
Copy-Item -Path "C:\Users\Desktop\aaa\*.md" -Destination "." -Force
Copy-Item -Path "C:\Users\Desktop\aaa\*.json" -Destination "." -Force
Copy-Item -Path "C:\Users\Desktop\aaa\.gitignore" -Destination "." -Force

# 3. Git에 파일 추가
git add .

# 4. 커밋 생성
git commit -m "Initial commit: 웹 프로젝트 템플릿"

# 5. GitHub에 푸시
git push -u origin master
```

## 🔧 문제 해결

### "fatal: refusing to merge unrelated histories" 오류
```bash
git pull origin master --allow-unrelated-histories
git push origin master
```

### 인증 오류
1. GitHub Personal Access Token 생성:
   - GitHub.com → Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - repo 권한 체크
   - 토큰 복사

2. 푸시할 때 비밀번호 대신 토큰 입력

### 브랜치 이름 문제 (master vs main)
```bash
# 현재 브랜치 확인
git branch

# main으로 변경하려면
git branch -M main
git push -u origin main
```

## 📋 Git 명령어 정리

```bash
# 상태 확인
git status

# 변경사항 확인
git diff

# 커밋 히스토리
git log --oneline

# 원격 저장소 확인
git remote -v

# 파일 추가
git add [파일명]
git add .  # 모든 파일

# 커밋
git commit -m "커밋 메시지"

# 푸시
git push origin master

# 풀 (원격 변경사항 가져오기)
git pull origin master
```

## 🔄 일일 작업 플로우

```bash
# 아침: 최신 코드 가져오기
git pull origin master

# 작업 중: 주기적 커밋
git add .
git commit -m "기능: 헤더 컴포넌트 수정"

# 저녁: GitHub에 푸시
git push origin master
```

## 📌 .gitignore 파일 확인

```
node_modules/
backups/
*.log
.env
.vscode/
```

## 🎯 성공 확인 방법

1. 브라우저에서 https://github.com/wewdfgdg-ship-it/aaa_01 접속
2. 파일들이 업로드되었는지 확인
3. README.md가 메인 페이지에 표시되는지 확인

## 💡 팁

- **커밋 메시지 규칙** 지키기 (docs/RULES.md 참조)
- **민감한 정보** (API 키, 비밀번호) 절대 커밋하지 않기
- **백업 시스템**과 **Git** 병행 사용 권장