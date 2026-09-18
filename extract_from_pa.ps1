[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$pa = Get-Content -Path "scratch/pa_posts.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$krrPosts = $pa | Where-Object { $_.user.name -like "*เกียรติรุ่งเรือง*" -or $_.text -like "*เกียรติรุ่งเรือง*" }

Write-Output "Found in pa_posts.json: $($krrPosts.Count)"

$idx = 1
$sb = [System.Text.StringBuilder]::new()
foreach ($p in $krrPosts) {
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("POST #$idx")
    [void]$sb.AppendLine("ID: $($p.postId)")
    [void]$sb.AppendLine("Time: $($p.time)")
    [void]$sb.AppendLine("URL: $($p.url)")
    [void]$sb.AppendLine("Likes: $($p.likes) | Shares: $($p.shares) | Media: $($p.media.Count)")
    [void]$sb.AppendLine("TEXT:")
    [void]$sb.AppendLine($p.text)
    [void]$sb.AppendLine("")
    $idx++
}

Set-Content -Path "scratch/krr_clean_summary.txt" -Value $sb.ToString() -Encoding UTF8
Write-Output "Written to scratch/krr_clean_summary.txt"
