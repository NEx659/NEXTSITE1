$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chrome)) {
    $chrome = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
}
$url = 'file:///c:/Users/pannipan/Downloads/N/scratch/test_want_followup.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_want_followup_out.html'

Start-Process -FilePath $chrome -ArgumentList '--headless=new', '--dump-dom', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$content = Get-Content $tempOut -Raw -Encoding UTF8
Write-Output $content
