[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$lines = Get-Content -Path "scratch/krr_raw_lines.txt" -Encoding UTF8
$posts = @()
$currentPost = @{}
$inText = $false
$textBuffer = @()

foreach ($line in $lines) {
    if ($line -match '"facebookUrl":\s*"https://www.facebook.com/profile.php\?id=61558614631187"') {
        if ($currentPost.Count -gt 0) {
            $currentPost.Text = ($textBuffer -join "`n")
            $posts += [PSCustomObject]$currentPost
        }
        $currentPost = @{
            Url = ""
            Time = ""
            PostId = ""
            Text = ""
            Likes = 0
            Shares = 0
        }
        $textBuffer = @()
        $inText = $false
    }
    if ($line -match '"url":\s*"([^"]+)"' -and -not $currentPost.Url) {
        $currentPost.Url = $matches[1]
    }
    if ($line -match '"postId":\s*"([^"]+)"') {
        $currentPost.PostId = $matches[1]
    }
    if ($line -match '"time":\s*"([^"]+)"') {
        $currentPost.Time = $matches[1]
    }
    if ($line -match '"reactionLikeCount":\s*([0-9]+)' -or $line -match '"likes":\s*([0-9]+)') {
        $currentPost.Likes = [int]$matches[1]
    }
    if ($line -match '"shares":\s*([0-9]+)') {
        $currentPost.Shares = [int]$matches[1]
    }
    if ($line -match '"text":\s*"([\s\S]*)$') {
        $inText = $true
        $t = $matches[1]
        if ($t -match '"\s*,\s*$') {
            $t = $t -replace '"\s*,\s*$', ''
            $textBuffer += ($t -replace '\\n', "`n" -replace '\\"', '"')
            $inText = $false
        } else {
            $textBuffer += ($t -replace '\\n', "`n" -replace '\\"', '"')
        }
        continue
    }
    if ($inText) {
        if ($line -match '^([\s\S]*)"\s*,\s*$') {
            $textBuffer += ($matches[1] -replace '\\n', "`n" -replace '\\"', '"')
            $inText = $false
        } else {
            $textBuffer += ($line -replace '\\n', "`n" -replace '\\"', '"')
        }
    }
}

if ($currentPost.Count -gt 0) {
    $currentPost.Text = ($textBuffer -join "`n")
    $posts += [PSCustomObject]$currentPost
}

Write-Output "Total KRR posts extracted: $($posts.Count)"

$sb = [System.Text.StringBuilder]::new()
$idx = 1
foreach ($p in $posts) {
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("POST #$idx")
    [void]$sb.AppendLine("ID: $($p.PostId)")
    [void]$sb.AppendLine("Time: $($p.Time)")
    [void]$sb.AppendLine("URL: $($p.Url)")
    [void]$sb.AppendLine("Likes: $($p.Likes) | Shares: $($p.Shares)")
    [void]$sb.AppendLine("TEXT:")
    [void]$sb.AppendLine($p.Text)
    [void]$sb.AppendLine("")
    $idx++
}

Set-Content -Path "scratch/krr_posts_clean.txt" -Value $sb.ToString() -Encoding UTF8
Write-Output "Saved to scratch/krr_posts_clean.txt"
