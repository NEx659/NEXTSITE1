$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
$item = $dataList | Where-Object { $_.id -eq "comp-udon-32" }
$item | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 "scratch/comp32_current.json"
Get-Content "scratch/comp32_current.json"
