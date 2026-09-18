[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = Get-Content "scratch/dataset.json" -Raw -Encoding UTF8
$items = $raw | ConvertFrom-Json

$matched = @()
foreach ($item in $items) {
    $fbUrl = $item.facebookUrl
    $url = $item.url
    $inUrl = $item.inputUrl
    $userId = if ($item.user) { $item.user.id } else { "" }
    
    if ($fbUrl -match "100034948943142" -or $url -match "100034948943142" -or $inUrl -match "100034948943142" -or $userId -eq "100034948943142") {
        $matched += $item
    }
}

Write-Host "Found $($matched.Count) posts for 100034948943142"

$lines = @()
$lines += "Total Posts Found: $($matched.Count)"
$idx = 1
foreach ($m in $matched) {
    $lines += "=================================================="
    $lines += "POST #$idx"
    $lines += "Time: $($m.time)"
    $lines += "URL: $($m.url)"
    $lines += "TopLevelURL: $($m.topLevelUrl)"
    $lines += "Likes: $($m.likes) | Comments: $($m.comments) | Shares: $($m.shares)"
    $lines += "TEXT:"
    $lines += "$($m.text)"
    $lines += ""
    $idx++
}

$lines | Set-Content -Path "scratch/rungaroon_posts_clean.txt" -Encoding UTF8
Write-Host "Written to scratch/rungaroon_posts_clean.txt"
