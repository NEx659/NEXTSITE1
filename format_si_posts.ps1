$raw = Get-Content 'scratch/si_posts.json' -Raw -Encoding UTF8
$posts = $raw | ConvertFrom-Json

$out = @()
$idx = 1
foreach ($p in $posts) {
    $date = if ($p.postDate) { $p.postDate } elseif ($p.postedTime) { $p.postedTime } elseif ($p.date) { $p.date } else { "N/A" }
    $url = if ($p.postUrl) { $p.postUrl } elseif ($p.url) { $p.url } else { "N/A" }
    $caption = if ($p.caption) { $p.caption } elseif ($p.text) { $p.text } else { "N/A" }
    $likes = if ($p.likes) { $p.likes } else { 0 }
    
    $block = "========================================`r`n"
    $block += "โพสต์ที่ $idx`r`n"
    $block += "วันที่: $date`r`n"
    $block += "URL: $url`r`n"
    $block += "ข้อความ (Caption):`r`n$caption`r`n"
    $block += "========================================`r`n"
    $out += $block
    $idx++
}

Set-Content -Path 'scratch/si_10posts_clean.txt' -Value $out -Encoding UTF8
Write-Output "Successfully wrote scratch/si_10posts_clean.txt"
