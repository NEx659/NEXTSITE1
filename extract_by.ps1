[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$content = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $content -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$by = $companies | Where-Object { $_.id -eq "comp-udon-31" -or $_.name -like "*บ้านใหญ่*" }
$by | ConvertTo-Json -Depth 10 | Out-File -FilePath "scratch\baanyai_data.json" -Encoding UTF8
Write-Output "Extracted baanyai data successfully"
