$content = Get-Content -Encoding UTF8 scratch/ehouse_posts.json -Raw
$posts = $content | ConvertFrom-Json
$i = 1
foreach ($p in $posts) {
    Write-Output "=== POST $i ==="
    Write-Output ("Date: " + $p.date + " | Time: " + $p.time)
    Write-Output ("URL: " + $p.url)
    Write-Output ("Text: " + $p.text)
    Write-Output ("PostText: " + $p.postText)
    Write-Output ""
    $i++
}
