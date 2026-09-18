[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$posts = $null
if (Test-Path "scratch/banwisawa_posts.json") {
    Write-Output "Loading from banwisawa_posts.json..."
    $posts = Get-Content -Raw -Encoding UTF8 "scratch/banwisawa_posts.json" | ConvertFrom-Json
} else {
    Write-Output "Loading from dataset.json..."
    $raw = Get-Content -Raw -Encoding UTF8 "scratch/dataset.json" | ConvertFrom-Json
    $comp = $raw.companies | Where-Object { $_.id -eq "comp-udon-27" -or $_.name -like "*บ้านวิศวะพัฒนา*" }
    $posts = $comp.posts
}

Write-Output "Total posts found: $($posts.Count)"

$out = @()
$idx = 1
foreach ($p in $posts) {
    $item = [PSCustomObject]@{
        Index = $idx
        Id = $p.id
        Time = $p.time
        Url = $p.url
        TopLevelUrl = $p.top_level_url
        Likes = $p.reaction_count
        Shares = $p.share_count
        MediaCount = $p.media_count
        Text = $p.text
    }
    $out += $item
    $idx++
}

$out | ConvertTo-Json -Depth 10 | Set-Content -Path "scratch/banwisawa_extracted.json" -Encoding UTF8
Write-Output "Saved to scratch/banwisawa_extracted.json"
