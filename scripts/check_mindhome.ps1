$posts = Get-Content 'scripts/facebook_54_pages_posts.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$mindPosts = $posts | Where-Object { 
    $_.facebookUrl -like "*MindHome.Grand*" -or 
    $_.url -like "*MindHome.Grand*" -or 
    $_.inputUrl -like "*MindHome.Grand*" -or 
    $_.pageName -eq "MindHome.Grand"
}

Write-Host "Found $($mindPosts.Count) posts for MindHome.Grand in scraped JSON:"
$i = 1
foreach ($p in $mindPosts) {
    Write-Host "`n[$i] URL: $($p.url)"
    Write-Host "    Date: $($p.time)"
    Write-Host "    Text: $(($p.text -replace '\n', ' ').Substring(0, [math]::Min(150, $p.text.Length)))..."
    $i++
}
