[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$content = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $content -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$entrust = $companies | Where-Object { $_.id -eq "comp-udon-57" -or $_.name -like "*เอ็นทรัสท*" -or $_.engName -like "*Entrust*" }
$entrust | ConvertTo-Json -Depth 10 | Out-File -FilePath "scratch\entrust_data.json" -Encoding UTF8
Write-Output "Extracted Entrust data successfully: $($entrust.Count)"
