[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$datasetPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
$posts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

$indices = @(12, 14, 18, 19, 131, 132, 134)
for ($k = 0; $k -lt $indices.Count; $k++) {
    $idx = $indices[$k]
    $p = $posts[$idx]
    Write-Host "========================================================="
    Write-Host "[$($k+1)] Index $idx | เพจ: $($p.pageName)"
    Write-Host "ข้อความ: $($p.text -replace "`r?`n", " ")"
}
