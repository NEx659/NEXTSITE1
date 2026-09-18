# Search dataset.json for any posts mentioning phone number or page name or variants
$datasetPath = "scratch/dataset.json"
$dataset = Get-Content -Raw -Encoding UTF8 $datasetPath | ConvertFrom-Json

$allKiddee = @()

foreach ($item in $dataset) {
    $str = $item | ConvertTo-Json -Depth 5
    if ($str -match '088-563-6587' -or $str -match '0885636587' -or $str -match 'Archtiger' -or $str -match 'คิดดี' -or $str -match 'Kiddee' -or ($item.user -and $item.user.name -match 'คิดดี')) {
        $allKiddee += $item
    }
}

Write-Host "Total matched items: $($allKiddee.Count)"

# Deduplicate
$unique = @()
$seen = @{}
foreach ($p in $allKiddee) {
    $k = if ($p.top_level_post_id) { $p.top_level_post_id } elseif ($p.top_level_url) { $p.top_level_url } elseif ($p.url) { $p.url } else { $p.text }
    if (-not $seen.ContainsKey($k)) {
        $seen[$k] = $true
        $unique += $p
    }
}

Write-Host "Total unique posts: $($unique.Count)"

$idx = 1
$txt = ""
$outList = @()
foreach ($p in $unique) {
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
        user = $p.user
    }
    $outList += $itemObj
    $txt += "==================================================`n"
    $txt += "POST #$idx`n"
    $txt += "URL: $($p.url)`n"
    $txt += "TOP_LEVEL_URL: $($p.top_level_url)`n"
    $txt += "DATE: $($p.time)`n"
    $txt += "LIKES: $($p.reactions_count) | COMMENTS: $($p.comments_count) | SHARES: $($p.shares_count)`n"
    $txt += "MEDIA_COUNT: $(if ($p.media_list) { $p.media_list.Count } else { 0 })`n"
    $txt += "PAGE/USER: $($p.user.name)`n"
    $txt += "TEXT:`n$($p.text)`n`n"
    $idx++
}

$outList | ConvertTo-Json -Depth 6 | Set-Content -Path "scratch/kiddee_all_posts.json" -Encoding UTF8
$txt | Set-Content -Path "scratch/kiddee_all_posts.txt" -Encoding UTF8
Write-Host "Saved $($outList.Count) posts to scratch/kiddee_all_posts.txt"
