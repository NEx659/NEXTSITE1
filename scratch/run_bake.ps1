$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }

$url = 'file:///c:/Users/pannipan/Downloads/N/scratch/bake_data.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\bake_out.html'

Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=10000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$res = Get-Content $tempOut -Raw -Encoding UTF8

if ($res -match '<pre id="baked-json">([\s\S]*?)</pre>') {
    $baked = $matches[1]
    $baked = [System.Net.WebUtility]::HtmlDecode($baked)
    $baked | Set-Content -Path 'c:\Users\pannipan\Downloads\N\js\data.js' -Encoding UTF8
    Write-Output "SUCCESS: Baked data written to js/data.js"
    if ($res -match 'DONE:\s*\d+\s*active projects') {
        Write-Output $matches[0]
    }
} else {
    Write-Output "FAILED to find baked-json. Output snippet:"
    $len = [Math]::Min(500, $res.Length)
    Write-Output $res.Substring(0, $len)
}
