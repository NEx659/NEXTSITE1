$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

$matches = @($data | Where-Object { 
    $_.facebookUrl -match 'siarchitecture' -or 
    $_.inputUrl -match 'siarchitecture' -or 
    $_.pageName -match 'เอสไอ' -or
    $_.postUrl -match 'siarchitecture' -or
    $_.url -match 'siarchitecture' -or
    $_.user -match 'siarchitecture'
})

Write-Output "Found matches: $($matches.Count)"
$matches | ConvertTo-Json -Depth 5 | Set-Content -Path 'c:\Users\pannipan\Downloads\N\scratch\si_posts.json' -Encoding UTF8
Write-Output "Wrote to c:\Users\pannipan\Downloads\N\scratch\si_posts.json"

$out = @()
$idx = 1
foreach ($p in $matches) {
    $date = if ($p.postDate) { $p.postDate } elseif ($p.postedTime) { $p.postedTime } elseif ($p.date) { $p.date } else { "N/A" }
    $url = if ($p.postUrl) { $p.postUrl } elseif ($p.url) { $p.url } else { "N/A" }
    $caption = if ($p.caption) { $p.caption } elseif ($p.text) { $p.text } else { "N/A" }
    $likes = if ($p.likes) { $p.likes } else { 0 }
    
    $block = "========================================`r`n"
    $block += "โพสต์ที่ $idx`r`n"
    $block += "วันที่: $date`r`n"
    $block += "URL: $url`r`n"
    $block += "Likes: $likes`r`n"
    $block += "ข้อความ (Caption):`r`n$caption`r`n"
    $block += "========================================`r`n"
    $out += $block
    $idx++
}

Set-Content -Path 'c:\Users\pannipan\Downloads\N\scratch\si_10posts_clean.txt' -Value $out -Encoding UTF8
Write-Output "Successfully wrote c:\Users\pannipan\Downloads\N\scratch\si_10posts_clean.txt"
