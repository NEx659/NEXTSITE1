$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }
$url = 'file:///c:/Users/pannipan/Downloads/N/index.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\validate_4tiers_dom.html'

Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=4000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$html = [System.IO.File]::ReadAllText($tempOut, [System.Text.Encoding]::UTF8)

Write-Host ("DOM Size: " + $html.Length + " bytes")
Write-Host ("Contains Strategic: " + $html.Contains("Strategic Partner"))
Write-Host ("Contains Growth: " + $html.Contains("Growth Account"))
Write-Host ("Contains Opportunity: " + $html.Contains("Opportunity Account"))
Write-Host ("Contains Prospect: " + $html.Contains("New Prospect"))
