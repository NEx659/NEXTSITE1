$dataContent = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $dataContent -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
$item = $dataList | Where-Object { $_.id -eq "comp-udon-16" }
$item | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 scratch/arch117_data.json
Get-Content scratch/arch117_data.json
