$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }
$url = 'file:///c:/Users/pannipan/Downloads/N/scratch/test_syhouse_modal.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_syhouse_out.html'
Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=3000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$html = Get-Content $tempOut -Raw -Encoding UTF8
if ($html -match '<pre id="modal-html">([\s\S]*?)</pre>') {
    Write-Output $matches[1]
} else {
    Write-Output 'Modal test did not find modal-html tag.'
}
