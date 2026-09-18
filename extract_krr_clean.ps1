[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$lines = Get-Content -Path "scratch/dataset.json" -Encoding UTF8
$inKrr = $false
$currentPostLines = @()
$posts = @()

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line -match '"facebookUrl":\s*"https://www.facebook.com/profile.php\?id=61558614631187"') {
        $inKrr = $true
        $currentPostLines = @($line)
        continue
    }
    if ($inKrr) {
        $currentPostLines += $line
        if ($line -match '^\s*},\s*$' -or $line -match '^\s*}\s*$') {
            # test if end of a post object
            $postJson = "{" + ($currentPostLines -join "`n")
            # check if it has inputUrl
            if ($currentPostLines -match '"inputUrl"') {
                try {
                    $p = $postJson | ConvertFrom-Json
                    $posts += $p
                } catch {}
                $currentPostLines = @()
            }
        }
        if ($line -match '"inputUrl":' -and $line -notmatch '61558614631187') {
            $inKrr = $false
            break
        }
    }
}

Write-Output "Successfully extracted $($posts.Count) posts for KRR"

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

Set-Content -Path "scratch/krr_posts_clean.txt" -Value $sb.ToString() -Encoding UTF8
Write-Output "Saved to scratch/krr_posts_clean.txt"
