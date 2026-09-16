[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$posts = if ($raw -is [array]) { $raw } else { $raw.items }

$dreamPosts = $posts | Where-Object { 
    $p = [string]$_.pageName
    $inp = [string]$_.inputUrl
    $fb = [string]$_.facebookUrl
    $p -match 'Dreamuphousebuilder' -or $inp -match 'Dreamuphousebuilder' -or $fb -match 'Dreamuphousebuilder'
}

Write-Host "Total raw posts for Dream Up in JSON: $($dreamPosts.Count)"
$idx = 1
foreach ($p in $dreamPosts) {
    Write-Host "------------------------------------"
    Write-Host "[$idx] URL: $($p.url)"
    $lines = $p.text -split "\r?\n"
    Write-Host "Line 1: $($lines[0])"
    if ($lines.Count -gt 1) { Write-Host "Line 2: $($lines[1])" }
    if ($lines.Count -gt 2) { Write-Host "Line 3: $($lines[2])" }
    $idx++
}
