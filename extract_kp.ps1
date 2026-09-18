[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$content = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $content -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$kp = $companies | Where-Object { $_.id -eq "comp-udon-20" }
$kp | ConvertTo-Json -Depth 10 | Out-File -FilePath "scratch\kp_data.json" -Encoding UTF8
Write-Output "Extracted comp-udon-20 successfully"
