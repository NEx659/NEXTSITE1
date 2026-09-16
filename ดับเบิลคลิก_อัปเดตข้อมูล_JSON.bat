@echo off
chcp 65001 >nul
echo ===================================================
echo   NEXTSITE AI - ระบบอัปเดตข้อมูลอัตโนมัติจาก Apify JSON
echo ===================================================
echo กำลังค้นหาไฟล์ JSON ล่าสุดจากโฟลเดอร์ Downloads...

powershell -ExecutionPolicy Bypass -Command "& {
    $latestDownload = Get-ChildItem -Path \"$env:USERPROFILE\Downloads\dataset_facebook-posts-scraper_*.json\" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($latestDownload) {
        Write-Host \"[1/2] พบไฟล์ล่าสุด: \" $latestDownload.Name -ForegroundColor Green
        Copy-Item $latestDownload.FullName 'scripts/facebook_54_pages_posts.json' -Force
        Write-Host \"[2/2] กำลังประมวลผลโครงการก่อสร้างจริง...\" -ForegroundColor Cyan
        & 'scripts/process_new_json.ps1'
        Write-Host \"`n✅ อัปเดตข้อมูลเข้าสู่ระบบเรียบร้อยแล้ว! (เปิดหรือรีเฟรชหน้า index.html ได้เลย)\" -ForegroundColor Green
    } else {
        Write-Host \"⚠️ ไม่พบไฟล์ dataset_facebook-posts-scraper_*.json ในโฟลเดอร์ Downloads\" -ForegroundColor Yellow
        Write-Host \"กำลังประมวลผลจากไฟล์ scripts/facebook_54_pages_posts.json แทน...\"
        & 'scripts/process_new_json.ps1'
    }
}"

echo.
echo กดปุ่มใดก็ได้เพื่อปิดหน้าต่างนี้...
pause >nul
