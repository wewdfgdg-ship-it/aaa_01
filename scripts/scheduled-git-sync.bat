@echo off
REM Windows 작업 스케줄러용 GitHub 자동 동기화
echo GitHub 자동 동기화 중...

REM 1. 파일 복사 (aaa → aaa_local)
xcopy /E /Y /Q C:\Users\Desktop\aaa\src C:\Users\Desktop\aaa_local\src\ >nul 2>&1
xcopy /E /Y /Q C:\Users\Desktop\aaa\docs C:\Users\Desktop\aaa_local\docs\ >nul 2>&1
xcopy /E /Y /Q C:\Users\Desktop\aaa\scripts C:\Users\Desktop\aaa_local\scripts\ >nul 2>&1
copy /Y C:\Users\Desktop\aaa\*.md C:\Users\Desktop\aaa_local\ >nul 2>&1
copy /Y C:\Users\Desktop\aaa\*.json C:\Users\Desktop\aaa_local\ >nul 2>&1
copy /Y C:\Users\Desktop\aaa\.gitignore C:\Users\Desktop\aaa_local\ >nul 2>&1

REM 2. Git 동기화
cd /d C:\Users\Desktop\aaa_local
git add . >nul 2>&1
git commit -m "자동 동기화 - %date% %time%" >nul 2>&1
git push origin master >nul 2>&1

echo 동기화 완료 - %date% %time% >> C:\Users\Desktop\aaa\backups\git-sync.log
exit