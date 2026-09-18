[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = Get-Content -Path "scratch/krr_raw_lines.txt" -Raw -Encoding UTF8
$wrapped = "[$raw]" -replace ',\s*\]$', ']'
$posts = $null
try {
    $posts = $wrapped | ConvertFrom-Json
} catch {
    # If JSON parse errors on trailing commas, clean it up
    $clean = "[" + ($raw -replace '}\s*,\s*{', '},{') + "]"
    $posts = $clean | ConvertFrom-Json
}

Write-Output "Parsed posts count: $($posts.Count)"

$sb = [System.Text.StringBuilder]::new()
$idx = 1
foreach ($p in $posts) {
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("POST #$idx")
    [void]$sb.AppendLine("ID: $($p.postId)")
    [void]$sb.AppendLine("Time: $($p.time)")
    [void]$sb.AppendLine("URL: $($p.url)")
    [void]$sb.AppendLine("TopLevelURL: $($p.topLevelUrl)")
    [void]$sb.AppendLine("Likes: $($p.likes) | Shares: $($p.shares) | Media: $($p.media.Count)")
    [void]$sb.AppendLine("TEXT:")
    [void]$sb.AppendLine($p.text)
    [void]$sb.AppendLine("")
    $idx++
}

Set-Content -Path "scratch/krr_parsed_posts.txt" -Value $sb.ToString() -Encoding UTF8
Write-Output "Written to scratch/krr_parsed_posts.txt"
