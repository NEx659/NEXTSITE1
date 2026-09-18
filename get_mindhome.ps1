$dataContent = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $dataContent -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
$item = $dataList | Where-Object { $_.id -eq "comp-udon-12" }
$item | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 scratch/mindhome_data.json
Get-Content scratch/mindhome_data.json
