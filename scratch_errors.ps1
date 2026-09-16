$datasetPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
$posts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

for ($i = 0; $i -lt $posts.Count; $i++) {
    $p = $posts[$i]
    if ($p.error -or $p.'#error' -or (-not $p.text -and -not $p.message -and -not $p.url -and -not $p.facebookUrl)) {
        Write-Host "Index $i is non-standard:"
        $p | ConvertTo-Json -Depth 3 | Write-Host
    }
}
