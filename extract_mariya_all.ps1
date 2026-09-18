[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$jsonText = [System.IO.File]::ReadAllText("$PSScriptRoot/dataset.json", [System.Text.Encoding]::UTF8)
$items = $jsonText | ConvertFrom-Json

$matched = [System.Collections.Generic.List[Object]]::new()
$uniqueUrls = @{}

foreach ($item in $items) {
    $str = $item | ConvertTo-Json -Compress -Depth 2
    if ($str -match '100090611883896' -or $str -match 'mariacons' -or $str -match 'มารีญาก่อสร้าง' -or $str -match 'มารีญา') {
        $url = $item.url
        if (-not $url) { $url = $item.topLevelUrl }
        if (-not $url) { $url = $item.postUrl }
        if ($url -and -not $uniqueUrls.ContainsKey($url)) {
            $uniqueUrls[$url] = $true
            $matched.Add($item)
        }
    }
}

Write-Output "Total unique posts found for 100090611883896: $($matched.Count)"

$sb = [System.Text.StringBuilder]::new()
$idx = 1
foreach ($p in $matched) {
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("POST #$idx")
    [void]$sb.AppendLine("URL: $($p.url)")
    [void]$sb.AppendLine("TOP_LEVEL_URL: $($p.topLevelUrl)")
    [void]$sb.AppendLine("DATE: $($p.time) $($p.date)")
    [void]$sb.AppendLine("LIKES: $($p.likes) $($p.reactionLikeCount) | COMMENTS: $($p.comments) | SHARES: $($p.shares)")
    [void]$sb.AppendLine("MEDIA_COUNT: $($p.media.Count)")
    [void]$sb.AppendLine("TEXT:")
    [void]$sb.AppendLine($p.text)
    [void]$sb.AppendLine("")
    $idx++
}

[System.IO.File]::WriteAllText("$PSScriptRoot/mariya_all_posts.txt", $sb.ToString(), [System.Text.Encoding]::UTF8)
$matched | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 "$PSScriptRoot/mariya_all_posts.json"
Write-Output "Saved to scratch/mariya_all_posts.txt and scratch/mariya_all_posts.json"
