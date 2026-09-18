$content = Get-Content -Encoding UTF8 scratch/rungrat_posts.json -Raw
$posts = $content | ConvertFrom-Json
for ($i = 0; $i -lt 8; $i++) {
    $p = $posts[$i]
    $num = $i + 1
    Write-Output "=== POST $num ==="
    Write-Output ("Date: " + $p.date + " | Time: " + $p.time)
    Write-Output ("URL: " + $p.url)
    $lines = $p.text.Split("`n")
    Write-Output ("Text preview: " + ($lines[0..3] -join " | "))
    Write-Output ""
}
