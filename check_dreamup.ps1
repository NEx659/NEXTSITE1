[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$items = if ($raw -is [array]) { $raw } else { $raw.items }

$dreamPosts = @()
foreach ($item in $items) {
    $t = [string]$item.text
    $u = if ($item.user) { [string]$item.user.name } else { '' }
    $p = [string]$item.pageName
    $inp = [string]$item.inputUrl
    $fb = [string]$item.facebookUrl
    
    if ($t -match 'DREAM UP' -or $t -match 'ดรีมอัพ' -or $u -match 'Udonhouse' -or $u -match 'DREAM UP' -or $p -match 'Udonhouse' -or $inp -match 'Dreamup' -or $fb -match 'Dreamup' -or $t -match 'คุณฝน' -or $t -match 'คุณเจนจิรา' -or $t -match 'คุณแพร') {
        $dreamPosts += $item
    }
}

Write-Host "Found $($dreamPosts.Count) posts matching Dream Up / Udonhouse / customer names"
$i = 1
foreach ($p in $dreamPosts) {
    Write-Host "============================="
    Write-Host "[$i] URL: $($p.url)"
    Write-Host "User: $($p.user.name)"
    Write-Host "PageName: $($p.pageName)"
    Write-Host "InputUrl: $($p.inputUrl)"
    Write-Host "FacebookUrl: $($p.facebookUrl)"
    $lines = $p.text -split "\r?\n"
    Write-Host "Line 1: $($lines[0])"
    if ($lines.Count -gt 1) { Write-Host "Line 2: $($lines[1])" }
    if ($lines.Count -gt 2) { Write-Host "Line 3: $($lines[2])" }
    $i++
}
