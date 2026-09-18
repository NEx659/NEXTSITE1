[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json

# Find all posts where text, url or inputUrl matches Cho Rungarun or 100034948943142
$posts = $json | Where-Object { 
    ($_.facebookUrl -and $_.facebookUrl.Contains('100034948943142')) -or
    ($_.url -and $_.url.Contains('100034948943142')) -or
    ($_.inputUrl -and $_.inputUrl.Contains('100034948943142')) -or
    ($_.text -and ($_.text -match 'ช\.รุ่งอรุณ' -or $_.text -match 'รุ่งอรุณ คอนสตรัคชั่น'))
}

Write-Host "Total posts found: $($posts.Count)"

$out = @()
$idx = 1
foreach ($p in $posts) {
    $out += "=================================================="
    $out += "POST #$idx"
    $out += "Time: $($p.time)"
    $out += "URL: $($p.url)"
    $out += "InputURL: $($p.inputUrl)"
    $out += "Post ID: $($p.id)"
    $out += "Likes: $($p.likes) | Comments: $($p.comments) | Shares: $($p.shares)"
    $out += "TEXT:"
    $out += "$($p.text)"
    $out += ""
    $idx++
}

$out | Set-Content -Path "scratch/rungaroon_posts_decoded.txt" -Encoding UTF8
Write-Host "Saved to scratch/rungaroon_posts_decoded.txt"
