[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = Get-Content -Path "scratch/krr_raw_lines.txt" -Raw -Encoding UTF8
# Take only until line 1480 (before Plan-D)
$krrRaw = $raw.Substring(0, $raw.IndexOf('"facebookUrl": "https://www.facebook.com/profile.php?id=61575470735221"'))

# Wrap into JSON array
$cleanJson = "[" + $krrRaw.Trim().TrimEnd(',') + "]"
$posts = $cleanJson | ConvertFrom-Json

Write-Output "Parsed KRR posts: $($posts.Count)"

$sb = [System.Text.StringBuilder]::new()
$idx = 1
foreach ($p in $posts) {
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("POST #$idx")
    [void]$sb.AppendLine("ID: $($p.postId)")
    [void]$sb.AppendLine("Time: $($p.time)")
    [void]$sb.AppendLine("URL: $($p.url)")
    [void]$sb.AppendLine("TopLevelURL: $($p.topLevelUrl)")
    [void]$sb.AppendLine("Likes: $($p.reactionLikeCount) | Shares: $($p.shares) | Media: $($p.media.Count)")
    [void]$sb.AppendLine("TEXT:")
    [void]$sb.AppendLine($p.text)
    [void]$sb.AppendLine("")
    $idx++
}

Set-Content -Path "scratch/krr_clean_posts.txt" -Value $sb.ToString() -Encoding UTF8
Write-Output "Saved to scratch/krr_clean_posts.txt"
