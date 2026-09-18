$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$obj = $jsonStr | ConvertFrom-Json
$item = $obj | Where-Object { $_.id -eq "comp-udon-49" }
$item | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 scratch/comp-udon-49.json
Get-Content scratch/comp-udon-49.json
