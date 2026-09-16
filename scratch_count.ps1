$datasetPath = 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json'
$posts = Get-Content -LiteralPath $datasetPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Filter out Apify error records (if any property like error or #error exists)
$validPosts = @()
foreach ($p in $posts) {
    if ($p.error -or $p.'#error' -or $p.PSObject.Properties['#error']) {
        continue
    }
    if (-not $p.text -and -not $p.message -and -not $p.url -and -not $p.facebookUrl) {
        continue
    }
    $validPosts += $p
}

Write-Host "Total raw in dataset: $($posts.Count)"
Write-Host "Total valid posts: $($validPosts.Count)"
