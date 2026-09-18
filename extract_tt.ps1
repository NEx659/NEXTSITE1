[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$content = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $content -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$tt = $companies | Where-Object { $_.id -eq "comp-udon-10" -or $_.name -like "*ทีที*" }
$tt | ConvertTo-Json -Depth 10 | Out-File -FilePath "scratch\tt_data.json" -Encoding UTF8
Write-Output "Extracted TT Design data successfully"
