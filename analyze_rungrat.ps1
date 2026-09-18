[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$posts = Get-Content "scratch/rungrat_posts.json" -Raw -Encoding UTF8 | ConvertFrom-Json
Write-Host "Total Rungrat posts: $($posts.Count)"

$idx = 1
foreach ($p in $posts) {
    Write-Host "=========================================="
    Write-Host "POST #$idx"
    Write-Host "Time: $($p.time)"
    Write-Host "URL: $($p.url)"
    $txt = $p.text
    if (-not $txt) { $txt = $p.postText }
    if (-not $txt) { $txt = $p.caption }
    
    # Check location keywords
    $loc = "Unknown"
    if ($txt -match "อ\.[^\s,]+ จ\.[^\s,]+") {
        $loc = $Matches[0]
    } elseif ($txt -match "จ\.[^\s,]+") {
        $loc = $Matches[0]
    } elseif ($txt -match "จังหวัด[^\s,]+") {
        $loc = $Matches[0]
    }
    Write-Host "Detected Location: $loc"
    $shortTxt = if ($txt.Length -gt 150) { $txt.Substring(0, 150) + "..." } else { $txt }
    Write-Host "Text preview: $shortTxt"
    $idx++
}
