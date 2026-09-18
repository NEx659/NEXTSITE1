[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }

$url = 'file:///c:/Users/pannipan/Downloads/N/scratch/test_full_nayoo_modal.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_full_nayoo_modal_out.html'

Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=3000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$res = Get-Content $tempOut -Raw -Encoding UTF8

if ($res -match '<pre id="modal-rendered-cards">([\s\S]*?)</pre>') {
    Write-Output "=== FULL NAYOO MODAL RENDERED ==="
    Write-Output $matches[1]
} else {
    Write-Output "Modal cards pre tag not found in DOM."
}
