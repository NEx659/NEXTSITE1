[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = Get-Content "scratch/dataset.json" -Raw -Encoding UTF8
$items = $raw | ConvertFrom-Json

$matched = @()
foreach ($item in $items) {
    $fbUrl = $item.facebookUrl
    $url = $item.url
    $inUrl = $item.inputUrl
    $pageName = $item.pageName
    $userName = if ($item.user) { $item.user.name } else { "" }
    $text = $item.text
    
    if ($fbUrl -match "maharungroj" -or $url -match "maharungroj" -or $inUrl -match "maharungroj" -or $pageName -match "maharungroj" -or $userName -match "มหารุ่งโรจน์" -or $text -match "MRB" -or $text -match "มหารุ่งโรจน์") {
        $matched += $item
    }
}

Write-Host "Found $($matched.Count) posts for maharungroj"

$lines = @()
$lines += "Total Posts Found: $($matched.Count)"
$idx = 1
foreach ($m in $matched) {
    $lines += "=================================================="
    $lines += "POST #$idx"
    $lines += "Post ID: $($m.postId)"
    $lines += "Time: $($m.time)"
    $lines += "URL: $($m.url)"
    $lines += "TopLevelURL: $($m.topLevelUrl)"
    $lines += "Likes: $($m.likes) | Comments: $($m.comments) | Shares: $($m.shares)"
    $lines += "Media Count: $(if ($m.media) { $m.media.Count } else { 0 })"
    $lines += "TEXT:"
    $lines += "$($m.text)"
    $lines += ""
    $idx++
}

$lines | Set-Content -Path "scratch/maharungroj_posts_clean.txt" -Encoding UTF8
Write-Host "Written to scratch/maharungroj_posts_clean.txt"
