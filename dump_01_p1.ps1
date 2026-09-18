$posts = Get-Content -Encoding UTF8 -Path "scratch/lecrown_posts.json" | ConvertFrom-Json
$p = $posts[0]
Write-Output ("Date: " + $p.time)
Write-Output ("URL: " + $p.url)
Write-Output ("TopLevelUrl: " + $p.topLevelUrl)
Write-Output ("Text: " + $p.text)
