$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromePath)) { $chromePath = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' }
$url = 'file:///c:/Users/pannipan/Downloads/N/index.html'
$tempOut = 'c:\Users\pannipan\Downloads\N\scratch\validate_render.html'
Start-Process -FilePath $chromePath -ArgumentList '--headless=new', '--allow-file-access-from-files', '--dump-dom', '--virtual-time-budget=4000', $url -RedirectStandardOutput $tempOut -NoNewWindow -Wait
$html = Get-Content $tempOut -Raw -Encoding UTF8
Write-Output "Render length: $($html.Length)"
if ($html -match 'ehouse_site_cafe_3storey_mueang_udon') {
    Write-Output "Found ehouse_site_cafe_3storey_mueang_udon in DOM!"
}
if ($html -match 'ehouse_site_builtin_minimal_udon') {
    Write-Output "Found ehouse_site_builtin_minimal_udon in DOM!"
}
if ($html -match 'ehouse_site_skim_paint_udon') {
    Write-Output "Found ehouse_site_skim_paint_udon in DOM!"
}
