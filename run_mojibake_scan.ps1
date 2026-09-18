$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }

$url = 'file:///c:/Users/pannipan/Downloads/N/scratch/test_mojibake_scan.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_mojibake_scan_out.html'

Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=5000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait

$res = Get-Content $tempOut -Raw -Encoding UTF8
Write-Output $res
