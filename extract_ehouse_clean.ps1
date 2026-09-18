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
    
    if ($fbUrl -match "esarnthaihouse" -or $url -match "esarnthaihouse" -or $inUrl -match "esarnthaihouse" -or $pageName -match "esarnthaihouse" -or $pageName -match "อีเฮาส์" -or $userName -match "อีเฮาส์" -or $text -match "esarnthaihouse" -or $text -match "อีเฮาส์" -or $text -match "อีสานไทยเฮาส์" -or $text -match "E-House" -or $text -match "Ehouse") {
        $matched += $item
    }
}

Write-Host "Found $($matched.Count) posts for Ehouse"

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

$lines | Set-Content -Path "scratch/ehouse_posts_clean.txt" -Encoding UTF8
Write-Host "Written to scratch/ehouse_posts_clean.txt"
