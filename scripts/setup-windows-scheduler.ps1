# Windows 작업 스케줄러 자동 백업 설정
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "⚙️ Windows 자동 백업 설정" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$taskName = "AAA_Project_Auto_Backup"
$description = "AAA 프로젝트 자동 백업 (1시간마다)"
$scriptPath = "C:\Users\Desktop\aaa\scripts\scheduled-backup.bat"

# 기존 작업 제거
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "기존 작업 제거 중..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# 작업 동작 설정
$action = New-ScheduledTaskAction -Execute $scriptPath

# 트리거 설정 (옵션 선택)
Write-Host "백업 주기를 선택하세요:" -ForegroundColor Green
Write-Host "1. 30분마다"
Write-Host "2. 1시간마다"
Write-Host "3. 2시간마다"
Write-Host "4. 컴퓨터 시작시"
Write-Host "5. 매일 오전 9시"
Write-Host ""
$choice = Read-Host "선택 (1-5)"

switch ($choice) {
    "1" { 
        $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 30) -RepetitionDuration (New-TimeSpan -Days 365)
        Write-Host "✅ 30분마다 백업 설정" -ForegroundColor Green
    }
    "2" { 
        $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 1) -RepetitionDuration (New-TimeSpan -Days 365)
        Write-Host "✅ 1시간마다 백업 설정" -ForegroundColor Green
    }
    "3" { 
        $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 2) -RepetitionDuration (New-TimeSpan -Days 365)
        Write-Host "✅ 2시간마다 백업 설정" -ForegroundColor Green
    }    "4" { 
        $trigger = New-ScheduledTaskTrigger -AtStartup
        Write-Host "✅ 컴퓨터 시작시 백업 설정" -ForegroundColor Green
    }
    "5" { 
        $trigger = New-ScheduledTaskTrigger -Daily -At 9AM
        Write-Host "✅ 매일 오전 9시 백업 설정" -ForegroundColor Green
    }
    default { 
        $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 1) -RepetitionDuration (New-TimeSpan -Days 365)
        Write-Host "✅ 기본값: 1시간마다 백업 설정" -ForegroundColor Green
    }
}

# 설정 생성
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# 작업 등록
try {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description $description -Force
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "✅ 자동 백업 설정 완료!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📌 작업 이름: $taskName" -ForegroundColor White
    Write-Host "📌 확인 방법: 작업 스케줄러 열기" -ForegroundColor White
    Write-Host "📌 수동 실행: schtasks /run /tn $taskName" -ForegroundColor White
    Write-Host "📌 제거 방법: schtasks /delete /tn $taskName" -ForegroundColor White
    
    # 즉시 실행 옵션
    Write-Host ""
    $runNow = Read-Host "지금 바로 테스트 실행하시겠습니까? (y/n)"
    if ($runNow -eq 'y') {
        Start-ScheduledTask -TaskName $taskName
        Write-Host "✅ 백업 실행 중..." -ForegroundColor Green
    }
} catch {
    Write-Host "❌ 설정 실패: $_" -ForegroundColor Red
    Write-Host "관리자 권한으로 실행해주세요." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "아무 키나 누르면 종료됩니다..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")