$raw = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/dataset.json", [System.Text.Encoding]::UTF8)
$dataset = $raw | ConvertFrom-Json

Write-Host "Total items in dataset: $($dataset.Count)"

$sdPosts = @()

foreach ($item in $dataset) {
    $str = $item | ConvertTo-Json -Depth 4
    if ($str -like "*เอสดี*" -or $str -like "*SD House*" -or $str -like "*sd house*" -or $str -like "*SD HOUSE*" -or $str -like "*sdhouse*") {
        $sdPosts += $item
    }
}

Write-Host "SD House matches found: $($sdPosts.Count)"

$sdJson = $sdPosts | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/scratch/sd_posts.json", $sdJson, [System.Text.Encoding]::UTF8)

# Now let's dump the text of the posts
$out = ""
$idx = 1
foreach ($item in $sdPosts) {
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

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/scratch/sd_10posts_clean.txt", $out, [System.Text.Encoding]::UTF8)
Write-Host "Saved to sd_10posts_clean.txt"
