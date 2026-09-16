[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$items = if ($raw -is [array]) { $raw } else { $raw.items }

$lh = @()
foreach ($item in $items) {
    $t = [string]$item.text
    $u = if ($item.user) { [string]$item.user.name } else { '' }
    $p = [string]$item.pageName
    $inp = [string]$item.inputUrl
    $fb = [string]$item.facebookUrl
    
    if ($t -match 'Little Home' -or $u -match 'Little Home' -or $p -match 'LH2553' -or $inp -match 'LH2553' -or $fb -match 'LH2553') {
        $lh += $item
    }
}

Write-Host "Total Little Home posts in dataset: $($lh.Count)"
for ($i=0; $i -lt $lh.Count; $i++) {
    $p = $lh[$i]
    Write-Host "----------------------------------------"
    Write-Host "[$($i+1)] Post URL: $($p.url)"
    $lines = $p.text -split "\r?\n"
    Write-Host "Line 1: $($lines[0])"
    if ($lines.Count -gt 1) { Write-Host "Line 2: $($lines[1])" }
    if ($lines.Count -gt 2) { Write-Host "Line 3: $($lines[2])" }
    if ($lines.Count -gt 3) { Write-Host "Line 4: $($lines[3])" }
}
