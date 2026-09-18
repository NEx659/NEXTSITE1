$content = Get-Content -Encoding UTF8 scratch/rungrat_posts.json -Raw
$posts = $content | ConvertFrom-Json
foreach ($idx in @(1, 3, 5, 7, 8)) {
    $p = $posts[$idx]
    Write-Output "=== POST $($idx+1) ==="
    Write-Output ("Date: " + $p.date + " | Time: " + $p.time)
    Write-Output $p.text
    Write-Output ""
}
