$dataset = Get-Content -Encoding UTF8 -Path "scratch/dataset.json" | ConvertFrom-Json
$posts = $dataset | Where-Object { 
    $_.facebookUrl -like "*61565401665404*" -or $_.inputUrl -like "*61565401665404*" -or $_.url -like "*61565401665404*"
}
Write-Output ("Found specific posts for Bandee Udon (61565401665404): " + $posts.Count)
for ($i = 0; $i -lt $posts.Count; $i++) {
    $p = $posts[$i]
    Write-Output ("================== POST " + ($i+1) + " ==================")
    Write-Output ("Date: " + $p.time)
    Write-Output ("URL: " + $p.url)
    Write-Output ("TopLevelUrl: " + $p.topLevelUrl)
    Write-Output ("Text: " + $p.text)
}
