$posts = Get-Content -Encoding UTF8 -Path "scratch/bandee_posts.json" | ConvertFrom-Json
$specific = $posts | Where-Object { 
    $_.facebookUrl -like "*61565401665404*" -or $_.inputUrl -like "*61565401665404*" -or $_.url -like "*61565401665404*" -or $_.topLevelUrl -like "*61565401665404*"
}
Write-Output ("Found specific Bandee Udon posts: " + $specific.Count)
for ($i = 0; $i -lt $specific.Count; $i++) {
    $p = $specific[$i]
    Write-Output ("================== POST " + ($i+1) + " ==================")
    Write-Output ("Date: " + $p.time)
    Write-Output ("URL: " + $p.url)
    Write-Output ("TopLevelUrl: " + $p.topLevelUrl)
    Write-Output ("Text: " + $p.text)
}
