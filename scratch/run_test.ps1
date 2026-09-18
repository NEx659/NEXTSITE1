$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chrome)) {
    $chrome = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
}
$url = 'file:///c:/Users/pannipan/Downloads/N/index.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\index_test_out.html'

Start-Process -FilePath $chrome -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=5000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$content = Get-Content $tempOut -Raw -Encoding UTF8
Write-Output "DOM Length: $($content.Length)"

$patterns = @('total-projects', 'kpi-active-projects', 'kpi-companies-count', 'contractor-count')
foreach ($p in $patterns) {
    if ($content -match "id=""$p""[^>]*>([^<]+)<") {
        Write-Output "$p : $($matches[1])"
    }
}


