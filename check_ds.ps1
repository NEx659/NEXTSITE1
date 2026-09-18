$content = Get-Content -Encoding UTF8 scratch/dataset.json -Raw
$data = $content | ConvertFrom-Json
$item = $data | Where-Object { $_.id -eq "comp-udon-49" -or $_.name -like "*นิติพันธ์*" }
$item | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 scratch/ds_49.json
Get-Content scratch/ds_49.json
