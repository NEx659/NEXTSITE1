$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
$item = $dataList | Where-Object { $_.id -eq "comp-udon-17" -or $_.name -like "*อีเฮาส์*" }
$item | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 scratch/ehouse_data.json
Get-Content scratch/ehouse_data.json
