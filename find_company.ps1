$dataRaw = Get-Content -Raw -Encoding UTF8 "js/data.js"
$prefix = "var UDON_COMPANIES = "
$trimmed = $dataRaw.Trim()
$json = $trimmed.Substring($prefix.Length).Trim().TrimEnd(';').Trim()
$obj = $json | ConvertFrom-Json
Write-Host "Total companies in data.js: $($obj.Count)"

$found = $obj | Where-Object { $_.name -match "ทีที" -or $_.name -match "TT" -or $_.id -eq "comp-udon-10" -or $_.facebookUrl -match "100057515256596" }
if ($found) {
    foreach ($f in $found) {
        Write-Host "Found: $($f.id) | $($f.name) | $($f.facebookUrl) | Projects: $($f.projects.Count)"
    }
} else {
    Write-Host "Searching dataset.json or all company IDs..."
    $obj | Select-Object -First 10 | ForEach-Object { Write-Host "$($_.id) : $($_.name)" }
}
