[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = Get-Content "scratch/dataset.json" -Raw -Encoding UTF8
$items = $raw | ConvertFrom-Json

$matched = @()
foreach ($item in $items) {
    $fbUrl = $item.facebookUrl
    $url = $item.url
    $inUrl = $item.inputUrl
    $pageName = $item.pageName
    $userId = if ($item.user) { $item.user.id } else { "" }
    $text = $item.text
    
    if ($fbUrl -match "100066713327564" -or $url -match "100066713327564" -or $inUrl -match "100066713327564" -or $userId -eq "100066713327564" -or $text -match "086-0539306" -or $text -match "095-2164459" -or $text -match "เคพีโฮม") {
        $matched += $item
    }
}

Write-Host "Found $($matched.Count) posts for KP Home"

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

$lines | Set-Content -Path "scratch/kphome_posts_clean.txt" -Encoding UTF8
Write-Host "Written to scratch/kphome_posts_clean.txt"
