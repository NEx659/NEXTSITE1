$posts = Get-Content 'scripts/facebook_54_pages_posts.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$mrbPosts = $posts | Where-Object { $_.pageName -like '*มหารุ่งโรจน์*' -or $_.facebookUrl -like '*maharungroj*' }
$i = 1
foreach ($p in $mrbPosts) {
    Write-Output "----------------------------------------"
    Write-Output "Post #$i | Date: $($p.postDate)"
    Write-Output "Caption: $($p.caption)"
    Write-Output "URL: $($p.postUrl)"
    $i++
}
