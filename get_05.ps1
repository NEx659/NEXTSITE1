$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$obj = $jsonStr | ConvertFrom-Json
$item = $obj | Where-Object { $_.id -eq "comp-udon-05" }
$item | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 scratch/item_05.json
Get-Content scratch/item_05.json
