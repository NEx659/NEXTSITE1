[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$posts = Get-Content -Raw -Encoding UTF8 "scratch/banwisawa_extracted.json" | ConvertFrom-Json
$sb = [System.Text.StringBuilder]::new()

foreach ($p in $posts) {
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("POST #$($p.Index)")
    [void]$sb.AppendLine("ID: $($p.Id)")
    [void]$sb.AppendLine("Time: $($p.Time)")
    [void]$sb.AppendLine("URL: $($p.Url)")
    [void]$sb.AppendLine("TopLevelURL: $($p.TopLevelUrl)")
    [void]$sb.AppendLine("Likes: $($p.Likes) | Shares: $($p.Shares) | Media: $($p.MediaCount)")
    [void]$sb.AppendLine("TEXT:")
    [void]$sb.AppendLine($p.Text)
    [void]$sb.AppendLine("")
}

Set-Content -Path "scratch/banwisawa_clean_summary.txt" -Value $sb.ToString() -Encoding UTF8
Write-Output "Written to scratch/banwisawa_clean_summary.txt"
