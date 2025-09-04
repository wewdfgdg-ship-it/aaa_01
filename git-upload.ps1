# GitHub 업로드 스크립트
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📦 프로젝트를 GitHub에 업로드" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. aaa 폴더 내용 복사 (node_modules, backups, .git 제외)
Write-Host "1. 프로젝트 파일 복사 중..." -ForegroundColor Green

$source = "C:\Users\Desktop\aaa"
$destination = "C:\Users\Desktop\aaa_local"

# 복사할 항목들
$items = @(
    "src",
    "docs", 
    "scripts",
    "tests",
    ".gitignore",
    "README.md",
    "package.json",
    "setup.bat",
    "setup.ps1"
)

foreach ($item in $items) {
    $sourcePath = Join-Path $source $item
    $destPath = Join-Path $destination $item
    
    if (Test-Path $sourcePath) {
        if ((Get-Item $sourcePath).PSIsContainer) {
            Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
            Write-Host "  ✅ 복사: $item (폴더)" -ForegroundColor Gray
        } else {
            Copy-Item -Path $sourcePath -Destination $destination -Force
            Write-Host "  ✅ 복사: $item (파일)" -ForegroundColor Gray
        }
    }
}

Write-Host ""
Write-Host "2. Git 저장소 설정 중..." -ForegroundColor Green
Set-Location -Path $destination

Write-Host ""
Write-Host "3. Git 상태 확인..." -ForegroundColor Green
git status

Write-Host ""
Write-Host "4. 모든 파일을 Git에 추가..." -ForegroundColor Green
git add .

Write-Host ""
Write-Host "5. 커밋 생성..." -ForegroundColor Green
$commitMessage = "Initial commit: 웹 프로젝트 템플릿 및 백업 시스템"
git commit -m $commitMessage

Write-Host ""
Write-Host "6. GitHub에 푸시 중..." -ForegroundColor Green
git push -u origin master

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ GitHub 업로드 완료!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 GitHub URL:" -ForegroundColor Yellow
Write-Host "   https://github.com/wewdfgdg-ship-it/aaa_01" -ForegroundColor White
Write-Host ""
Write-Host "📋 다음 단계:" -ForegroundColor Yellow
Write-Host "   1. 위 URL로 접속하여 확인" -ForegroundColor White
Write-Host "   2. README.md 파일이 표시되는지 확인" -ForegroundColor White
Write-Host "   3. 팀원과 저장소 공유" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "아무 키나 누르면 종료됩니다..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")