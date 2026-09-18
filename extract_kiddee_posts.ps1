# Extract all posts of Kiddee House Construction from dataset.json
$datasetPath = "scratch/dataset.json"
$dataset = Get-Content -Raw -Encoding UTF8 $datasetPath | ConvertFrom-Json

$matchedPosts = @()

foreach ($item in $dataset) {
    $str = $item | ConvertTo-Json -Depth 5
    if ($str -match 'คิดดีเฮาส์' -or $str -match 'Kiddeehouse' -or $str -match '100063688177583' -or ($item.user -and $item.user.name -match 'คิดดีเฮาส์')) {
        $matchedPosts += $item
    }
}

Write-Host "Total matched items: $($matchedPosts.Count)"

# Clean deduplication by text / post id / top_level_url
$uniquePosts = @()
$seenKeys = @{}

foreach ($p in $matchedPosts) {
    $key = if ($p.top_level_post_id) { $p.top_level_post_id } elseif ($p.top_level_url) { $p.top_level_url } elseif ($p.url) { $p.url } else { $p.text.Substring(0, [Math]::Min(30, $p.text.Length)) }
    if (-not $seenKeys.ContainsKey($key)) {
        $seenKeys[$key] = $true
        $uniquePosts += $p
    }
}

Write-Host "Unique posts count: $($uniquePosts.Count)"

$outList = @()
$txtOut = ""
$idx = 1

foreach ($p in $uniquePosts) {
    $itemObj = [PSCustomObject]@{
        index = $idx
        url = $p.url
        top_level_url = $p.top_level_url
        time = $p.time
        timestamp = $p.timestamp
        likes = $p.reactions_count
        comments = $p.comments_count
        shares = $p.shares_count
        media_count = if ($p.media_list) { $p.media_list.Count } else { 0 }
        media_list = $p.media_list
        text = $p.text
    }
    $outList += $itemObj
    
    $txtOut += "==================================================`n"
    $txtOut += "POST #$idx`n"
    $txtOut += "URL: $($p.url)`n"
    $txtOut += "TOP_LEVEL_URL: $($p.top_level_url)`n"
    $txtOut += "DATE: $($p.time) `n"
    $txtOut += "LIKES: $($p.reactions_count) | COMMENTS: $($p.comments_count) | SHARES: $($p.shares_count)`n"
    $txtOut += "MEDIA_COUNT: $(if ($p.media_list) { $p.media_list.Count } else { 0 })`n"
    $txtOut += "TEXT:`n$($p.text)`n`n"
    
    $idx++
}

$outList | ConvertTo-Json -Depth 6 | Set-Content -Path "scratch/kiddee_all_posts.json" -Encoding UTF8
$txtOut | Set-Content -Path "scratch/kiddee_all_posts.txt" -Encoding UTF8
Write-Host "Saved to scratch/kiddee_all_posts.json and scratch/kiddee_all_posts.txt"
