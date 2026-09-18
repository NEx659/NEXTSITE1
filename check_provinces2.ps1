$content = [System.IO.File]::ReadAllText("$pwd/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$companies = $jsonStr | ConvertFrom-Json

Write-Host "Total count in data.js: $($companies.Count)"

$byProv = @{}
$nonUdon = @()

foreach ($c in $companies) {
    $p = if ($c.province) { $c.province } else { "UNKNOWN" }
    if (-not $byProv.ContainsKey($p)) { $byProv[$p] = 0 }
    $byProv[$p]++
    
    if ($p -ne "อุดรธานี") {
        $nonUdon += $c
    }
}

Write-Host "=== Province breakdown ==="
$byProv.GetEnumerator() | ForEach-Object {
    Write-Host "$($_.Key) : $($_.Value)"
}

Write-Host "`n=== Non-Udon companies ==="
foreach ($c in $nonUdon) {
    Write-Host "ID: $($c.id) | Name: $($c.name) | Province: $($c.province) | District: $($c.district)"
}
