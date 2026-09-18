$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }

$url = 'file:///c:/Users/pannipan/Downloads/N/scratch/test_nayoo_extraction.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_nayoo_out.html'

Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=3000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$res = Get-Content $tempOut -Raw -Encoding UTF8

if ($res -match '<pre id="result-json">([\s\S]*?)</pre>') {
    Write-Output $matches[1]
} else {
    Write-Output "Result not found in DOM:"
    Write-Output $res
}
