[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$content = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $content -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$mr = $companies | Where-Object { $_.id -eq "comp-udon-05" -or $_.name -like "*มหารุ่งโรจน์*" }
$mr | ConvertTo-Json -Depth 10 | Out-File -FilePath "scratch\mr_data.json" -Encoding UTF8
Write-Output "Extracted Maharungroj data successfully: $($mr.Count)"
