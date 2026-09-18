# Check provinces of all 58 companies in data.js
$content = Get-Content -Raw -Encoding UTF8 "js/data.js"
$jsonStr = $content -replace '^var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$companies = $jsonStr | ConvertFrom-Json

Write-Host "Total companies in data.js: $($companies.Count)"

$byProvince = @{}
$nonUdon = @()

foreach ($c in $companies) {
    $prov = if ($c.province) { $c.province } else { "UNKNOWN" }
    if (-not $byProvince.ContainsKey($prov)) { $byProvince[$prov] = 0 }
    $byProvince[$prov]++
    
    if ($prov -ne "อุดรธานี") {
        $nonUdon += $c
    }
}

Write-Host "=== Province Breakdown ==="
$byProvince.GetEnumerator() | ForEach-Object {
    Write-Host "$($_.Key): $($_.Value) companies"
}

Write-Host "`n=== Companies NOT in อุดรธานี ==="
foreach ($c in $nonUdon) {
    Write-Host "ID: $($c.id) | Name: $($c.name) | Province: $($c.province) | District: $($c.district)"
}
