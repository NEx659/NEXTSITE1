$dataContent = Get-Content -Path 'js/data.js' -Raw -Encoding UTF8
$cleanJson = $dataContent -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$companies = $cleanJson | ConvertFrom-Json
$comp = $companies | Where-Object { $_.id -eq 'comp-udon-06' }
$comp | ConvertTo-Json -Depth 6 | Out-File -Encoding UTF8 "scratch/comp06_detail.json"
Write-Output "Saved comp-udon-06 to scratch/comp06_detail.json"
