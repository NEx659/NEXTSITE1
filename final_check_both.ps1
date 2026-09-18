[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = [System.IO.File]::ReadAllText("$PSScriptRoot/../js/data.js", [System.Text.Encoding]::UTF8)
$cleanJson = $raw -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$arr = $cleanJson | ConvertFrom-Json
$u11 = $arr | Where-Object { $_.id -eq "comp-udon-11" }
$c06 = $arr | Where-Object { $_.id -eq "comp-udon-06" }

Write-Output "--- VERIFICATION REPORT ---"
Write-Output "1. comp-udon-06 ($($c06.name)): $($c06.projects.Count) projects (Expected: 2)"
Write-Output "2. comp-udon-11 ($($u11.name)): $($u11.projects.Count) projects (Expected: 8)"
Write-Output "Total companies in database: $($arr.Count)"
