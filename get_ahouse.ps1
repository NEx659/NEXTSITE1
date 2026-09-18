$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$filtered = $raw | Where-Object { 
    $_.facebookUrl -match 'ahouse\.builder' -or 
    $_.inputUrl -match 'ahouse\.builder' -or 
    $_.pageName -match 'เอ เฮ้าส์' -or 
    $_.company -match 'เอ เฮ้าส์' -or
    $_.pageTitle -match 'A-House'
}

Write-Output "Total matches: $($filtered.Count)"

$results = @()
$seen = @{}
foreach ($p in $filtered) {
    $u = if ($p.postUrl) { $p.postUrl } else { $p.url }
    if (-not $seen[$u]) {
        $seen[$u] = $true
        $results += $p
    }
}

Write-Output "Unique matches: $($results.Count)"

$results | Select-Object -First 12 | ConvertTo-Json -Depth 5 | Set-Content 'c:\Users\pannipan\Downloads\N\scratch\ahouse_posts.json' -Encoding UTF8
Write-Output "Saved to scratch/ahouse_posts.json"
