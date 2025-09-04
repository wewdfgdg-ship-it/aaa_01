@echo off
echo ========================================
echo 📦 프로젝트를 GitHub에 업로드
echo ========================================
echo.

echo 1. aaa 폴더의 내용을 aaa_local로 복사 중...
xcopy /E /H /Y C:\Users\Desktop\aaa\* C:\Users\Desktop\aaa_local\ /EXCLUDE:C:\Users\Desktop\aaa_local\exclude.txt

echo.
echo 2. Git 저장소로 이동...
cd C:\Users\Desktop\aaa_local

echo.
echo 3. Git 상태 확인...
git status

echo.
echo 4. 모든 파일 추가...
git add .

echo.
echo 5. 첫 커밋 생성...
git commit -m "Initial commit: 프로젝트 템플릿 및 백업 시스템"

echo.
echo 6. GitHub에 푸시...
git push -u origin master

echo.
echo ========================================
echo ✅ GitHub 업로드 완료!
echo ========================================
echo.
echo GitHub URL: https://github.com/wewdfgdg-ship-it/aaa_01
echo.
pause