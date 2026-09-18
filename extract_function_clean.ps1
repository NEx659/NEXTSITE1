$jsonText = [System.IO.File]::ReadAllText("$PSScriptRoot/dataset.json", [System.Text.Encoding]::UTF8)
$items = $jsonText | ConvertFrom-Json

$matchedList = [System.Collections.Generic.List[Object]]::new()
$i = 0
foreach ($item in $items) {
    $str = $item | ConvertTo-Json -Compress -Depth 2
    if ($str -match '100077712244902' -or $str -match 'Function Design' -or $str -match 'ฟังก์ชั่น ดีไซน์' -or $str -match 'ฟังก์ชั่น') {
        $matchedList.Add($item)
        Write-Output "Post $i : $($item.date) | Likes: $($item.likes) | Comments: $($item.comments) | URL: $($item.url)"
        $snippet = if ($item.text) { $item.text.Substring(0, [Math]::Min(100, $item.text.Length)) } else { "" }
        Write-Output "   Text: $snippet"
    }
    $i++
}

Write-Output "Total matched posts: $($matchedList.Count)"

# Output each post in clean formatted text to a file for analysis
$sb = [System.Text.StringBuilder]::new()
$pNum = 1
foreach ($p in $matchedList) {
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("POST #$pNum")
    [void]$sb.AppendLine("URL: $($p.url)")
    [void]$sb.AppendLine("DATE: $($p.date)")
    [void]$sb.AppendLine("LIKES: $($p.likes) | COMMENTS: $($p.comments) | SHARES: $($p.shares)")
    [void]$sb.AppendLine("IMAGES: $($p.media.Count)")
    [void]$sb.AppendLine("TEXT:")
    [void]$sb.AppendLine($p.text)
    [void]$sb.AppendLine("")
    $pNum++
}

[System.IO.File]::WriteAllText("$PSScriptRoot/function_design_10posts_clean.txt", $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Output "Saved to scratch/function_design_10posts_clean.txt"
