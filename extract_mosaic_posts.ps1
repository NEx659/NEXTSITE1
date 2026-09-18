$raw = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/dataset.json", [System.Text.Encoding]::UTF8)
$dataset = $raw | ConvertFrom-Json

Write-Host "Total items in dataset: $($dataset.Count)"

$mosaicPosts = @()

foreach ($item in $dataset) {
    $str = $item | ConvertTo-Json -Depth 4
    if ($str -like "*mosaic*" -or $str -like "*โมเสค*" -or $str -like "*0864583151*" -or $str -like "*086-458-3151*" -or $str -like "*Mosaic*") {
        $mosaicPosts += $item
    }
}

Write-Host "Mosaic matches found: $($mosaicPosts.Count)"

$mosaicJson = $mosaicPosts | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/scratch/mosaic_posts.json", $mosaicJson, [System.Text.Encoding]::UTF8)

# Now let's dump the text of the posts
$out = ""
$idx = 1
foreach ($item in $mosaicPosts) {
    $time = $item.time
    $url = $item.url
    $likes = $item.likes
    $comments = $item.comments
    $shares = $item.shares
    $text = $item.text
    
    $out += "==================================================" + [Environment]::NewLine
    $out += "POST_$idx" + [Environment]::NewLine
    $out += "TIME: $time" + [Environment]::NewLine
    $out += "URL: $url" + [Environment]::NewLine
    $out += "LIKES: $likes | COMMENTS: $comments | SHARES: $shares" + [Environment]::NewLine
    $out += "TEXT:" + [Environment]::NewLine
    $out += "$text" + [Environment]::NewLine
    $out += "==================================================" + [Environment]::NewLine + [Environment]::NewLine
    $idx++
}

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/scratch/mosaic_10posts_clean.txt", $out, [System.Text.Encoding]::UTF8)
Write-Host "Saved to mosaic_10posts_clean.txt"
