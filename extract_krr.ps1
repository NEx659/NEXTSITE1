[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$content = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $content -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$krr = $companies | Where-Object { $_.id -eq "comp-udon-56" -or $_.name -like "*เกียรติรุ่งเรือง*" }
$krr | ConvertTo-Json -Depth 10 | Out-File -FilePath "scratch\krr_data.json" -Encoding UTF8
Write-Output "Extracted KRR data successfully: $($krr.Count)"
