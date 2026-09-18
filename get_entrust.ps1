$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
$item = $dataList | Where-Object { $_.id -eq "comp-udon-57" -or $_.name -like "*เอ็นทรัสท*" }
$item | ConvertTo-Json -Depth 6 | Out-File -Encoding utf8 "scratch/entrust_current.json"
