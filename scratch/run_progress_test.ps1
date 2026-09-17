$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) {
    $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
}

$url = 'file:///c:/Users/pannipan/Downloads/N/scratch/test_progress_render.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_progress_out.html'

Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--dump-dom', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
Get-Content $tempOut -Raw -Encoding UTF8 | Select-String -Pattern "project-progress-container" -Context 2, 8
