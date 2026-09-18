$posts = Get-Content -Encoding UTF8 -Path "scratch/lakam_posts.json" | ConvertFrom-Json
for ($i = 0; $i -lt 2; $i++) {
    $p = $posts[$i]
    Write-Output ("================== POST " + ($i+1) + " ==================")
    Write-Output ("Date: " + $p.time)
    Write-Output ("URL: " + $p.url)
    Write-Output ("TopLevelUrl: " + $p.topLevelUrl)
    Write-Output ("Text: " + $p.text)
}
