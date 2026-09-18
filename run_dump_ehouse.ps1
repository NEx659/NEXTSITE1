[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) { 
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" 
}

$url = "file:///c:/Users/pannipan/Downloads/N/scratch/dump_ehouse_all.html"
$tempOut = "c:\Users\pannipan\Downloads\N\scratch\ehouse_all_out.html"

Start-Process -FilePath $chromePath -ArgumentList "--headless=new", "--allow-file-access-from-files", "--dump-dom", "--virtual-time-budget=3000", $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait

$html = Get-Content $tempOut -Raw -Encoding UTF8
if ($html -match '<pre id="out">([\s\S]*?)</pre>') {
    Set-Content -Path "c:\Users\pannipan\Downloads\N\scratch\ehouse_all_posts.json" -Value $matches[1] -Encoding UTF8
    Write-Output "Saved ehouse_all_posts.json successfully!"
} else {
    Write-Output "Failed to extract from DOM."
}
