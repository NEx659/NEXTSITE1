$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }

$url = 'file:///c:/Users/pannipan/Downloads/N/index.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\test_error_out.html'

Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--enable-logging', '--v=1', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait

$res = Get-Content $tempOut -Raw -Encoding UTF8
Write-Output "Rendered HTML length: $($res.Length)"

# Check if table has rows rendered
if ($res -match '<tbody id="companies-table-body">([\s\S]*?)</tbody>') {
    $tbody = $matches[1]
    $rowCount = ([regex]::Matches($tbody, '<tr')).Count
    Write-Output "Rendered table rows count: $rowCount"
} else {
    Write-Output "tbody not found or empty!"
}
