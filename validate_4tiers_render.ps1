$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }
$url = 'file:///c:/Users/pannipan/Downloads/N/index.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\validate_4tiers_dom.html'

Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=4000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$html = [System.IO.File]::ReadAllText($tempOut, [System.Text.Encoding]::UTF8)

Write-Host "DOM Size: $($html.Length) bytes"

$t1 = $html.Contains("Strategic Partner/ลูกค้าแฟนพันธ์แท้")
$t2 = $html.Contains("Growth Account / ลูกค้าทีมีความสัมพันธ์ แต่ต้อติดตามอย่างใกล้ชิด")
$t3 = $html.Contains("Opportunity Account / ลูกค้าที่ต้องสร้างความสัมพันธ์")
$t4 = $html.Contains("New Prospect / ลูกค้าใหม่")

Write-Host "Tooltip 1 (Strategic): $t1"
Write-Host "Tooltip 2 (Growth): $t2"
Write-Host "Tooltip 3 (Opportunity): $t3"
Write-Host "Tooltip 4 (Prospect): $t4"

$b1 = $html.Contains("👑 Strategic")
$b2 = $html.Contains("📈 Growth")
$b3 = $html.Contains("🎯 Opportunity")
$b4 = $html.Contains("✨ Prospect")

Write-Host "Button 1 (Strategic): $b1"
Write-Host "Button 2 (Growth): $b2"
Write-Host "Button 3 (Opportunity): $b3"
Write-Host "Button 4 (Prospect): $b4"
