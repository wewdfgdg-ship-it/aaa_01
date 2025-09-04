@echo off
REM Windows 작업 스케줄러용 자동 백업 스크립트
cd /d C:\Users\Desktop\aaa
node scripts\backup-manager.js create "작업 스케줄러 자동 백업 - %date% %time%"
exit