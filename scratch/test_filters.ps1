$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$url = 'file:///c:/Users/pannipan/Downloads/N/scratch/test_ahouse_filters.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_ahouse_out.html'

Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=10000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$res = Get-Content $tempOut -Raw -Encoding UTF8

if ($res -match '<pre id="result-json">([\s\S]*?)</pre>') {
    $out = [System.Net.WebUtility]::HtmlDecode($matches[1])
    Write-Output $out
} else {
    Write-Output "Snippet: " + $res.Substring(0, [Math]::Min(500, $res.Length))
}
