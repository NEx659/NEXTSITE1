[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$postsJson = Get-Content 'C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_2026-09-16_05-47-36-004.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$items = if ($postsJson -is [array]) { $postsJson } else { $postsJson.items }

$dream = $items | Where-Object { 
    $t = [string]$_.text
    $t -match 'DREAM UP' -and ($t -match 'คุณฝน' -or $t -match 'คุณเจนจิรา' -or $t -match 'คุณพร')
}

Write-Host "Found $($dream.Count) specific Dream Up posts"
foreach ($p in $dream) {
    Write-Host "===================="
    Write-Host "URL: $($p.url)"
    $lines = $p.text -split "\r?\n"
    Write-Host "Lines count: $($lines.Count)"
    for ($k=0; $k -lt [Math]::Min(5, $lines.Count); $k++) {
        Write-Host "  [$k]: $($lines[$k])"
    }
}
