[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$content = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $content -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$ct = $companies | Where-Object { $_.id -eq "comp-udon-42" -or $_.name -like "*ซีที*" -or $_.engName -like "*CT*" }
$ct | ConvertTo-Json -Depth 10 | Out-File -FilePath "scratch\ct_data.json" -Encoding UTF8
Write-Output "Extracted CT data successfully: $($ct.Count)"
