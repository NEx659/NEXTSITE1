[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$lines = Get-Content -Path "scratch/dataset.json" -Encoding UTF8
$posts = @()
$collecting = $false
$currentLines = @()

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line -match '"facebookUrl":\s*"https://www.facebook.com/profile.php\?id=61558614631187"' -or $line -match '"profileUrl":\s*"https://www.facebook.com/61558614631187"') {
        if ($collecting -and $currentLines.Count -gt 0) {
            $rawBlock = "{" + ($currentLines -join "`n")
            if ($rawBlock.Trim().EndsWith(",")) { $rawBlock = $rawBlock.Substring(0, $rawBlock.Length - 1) }
            try {
                $p = $rawBlock | ConvertFrom-Json
                $posts += $p
            } catch {}
        }
        $collecting = $true
        $currentLines = @($line)
        continue
    }
    if ($collecting) {
        $currentLines += $line
        if ($line -match '"facebookUrl":' -and $line -notmatch '61558614631187') {
            # reached next company
            $collecting = $false
            $rawBlock = "{" + ($currentLines -join "`n")
            if ($rawBlock.Trim().EndsWith(",")) { $rawBlock = $rawBlock.Substring(0, $rawBlock.Length - 1) }
            try {
                $p = $rawBlock | ConvertFrom-Json
                $posts += $p
            } catch {}
            $currentLines = @()
        }
    }
}

Write-Output "Found posts: $($posts.Count)"

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

Set-Content -Path "scratch/krr_all_found.txt" -Value $sb.ToString() -Encoding UTF8
Write-Output "Saved to scratch/krr_all_found.txt"
