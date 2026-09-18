$posts = Get-Content 'scratch/syhouse_posts.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$out = ""
$idx = 1
foreach ($p in $posts) {
    $out += "========================================================`n"
    $out += "POST #$idx`n"
    $out += "Date: $($p.time)`n"
    $out += "URL: $($p.url)`n"
    $out += "Likes: $($p.likes) | Comments: $($p.comments) | Shares: $($p.shares)`n"
    $out += "Content:`n$($p.text)`n`n"
    $idx++
}
Set-Content -Path 'scratch/syhouse_10posts.txt' -Value $out -Encoding UTF8
Write-Output "Written 10 posts to scratch/syhouse_10posts.txt"
