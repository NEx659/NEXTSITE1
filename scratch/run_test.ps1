$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chrome)) {
    $chrome = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
}
$url = 'file:///c:/Users/pannipan/Downloads/N/scratch/bake_data.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_tag_out.html'

Start-Process -FilePath $chrome -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=8000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$content = Get-Content $tempOut -Raw -Encoding UTF8
if ($content -match '<pre id="log-output">([\s\S]*?)</pre>') {
    $decoded = [System.Net.WebUtility]::HtmlDecode($matches[1])
    Write-Output $decoded
} else {
    Write-Output $content
}












