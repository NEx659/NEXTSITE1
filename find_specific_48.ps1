$p = Get-Content -Encoding UTF8 -Path "scratch/bandee_posts.json" | ConvertFrom-Json
for ($i = 0; $i -lt $p.Count; $i++) {
    $item = $p[$i]
    if ($item.url -like "*61565401665404*" -or $item.facebookUrl -like "*61565401665404*" -or $item.topLevelUrl -like "*61565401665404*") {
        Write-Output ("Found: " + $item.url)
        Write-Output ("Top: " + $item.topLevelUrl)
        Write-Output ("Time: " + $item.time)
        Write-Output ("Text: " + $item.text)
    }
}
