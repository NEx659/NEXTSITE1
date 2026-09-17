$appJs = Get-Content 'c:\Users\pannipan\Downloads\N\js\app.js' -Raw -Encoding UTF8

Write-Host "1. Check getProjectProgressInfo exists:"
Write-Host " - $( $appJs.Contains('function getProjectProgressInfo(proj)') )"

Write-Host "`n2. Check project-progress-container exists:"
Write-Host " - $( $appJs.Contains('project-progress-container') )"

Write-Host "`n3. Check milestone steps:"
Write-Host " - 10-15% เสาเอก: $( $appJs.Contains('10-15% เสาเอก') )"
Write-Host " - 30-35% ฐานราก: $( $appJs.Contains('30-35% ฐานราก') )"
Write-Host " - 50-60% โครงสร้าง: $( $appJs.Contains('50-60% โครงสร้าง') )"
Write-Host " - 75-85% ตกแต่ง: $( $appJs.Contains('75-85% ตกแต่ง') )"
Write-Host " - 98% ส่งมอบ: $( $appJs.Contains('98% ส่งมอบ') )"
