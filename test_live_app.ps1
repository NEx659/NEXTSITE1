$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }

$url = 'file:///c:/Users/pannipan/Downloads/N/index.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_vercel_out.html'

Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--dump-dom', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$res = Get-Content $tempOut -Raw -Encoding UTF8

Write-Output ("Live DOM Length: " + $res.Length)
Write-Output ("Contains NEXTSITE AI: " + $res.Contains("NEXTSITE AI"))
Write-Output ("Contains contractor-row: " + $res.Contains("contractor-row"))
Write-Output ("Contains Focus: " + $res.Contains("Focus"))
