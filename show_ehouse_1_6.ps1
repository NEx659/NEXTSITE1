$content = Get-Content -Encoding UTF8 scratch/ehouse_posts.json -Raw
$posts = $content | ConvertFrom-Json
for ($i = 0; $i -lt 6; $i++) {
    $p = $posts[$i]
    $num = $i + 1
    Write-Output "=== POST $num ==="
    Write-Output ("Date: " + $p.date + " | Time: " + $p.time)
    Write-Output ("URL: " + $p.url)
    Write-Output ("Text: " + $p.text)
    Write-Output ("PostText: " + $p.postText)
    Write-Output ""
}
