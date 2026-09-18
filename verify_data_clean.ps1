[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$data = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$clean = $data -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$arr = $clean | ConvertFrom-Json
Write-Output "Total Companies: $($arr.Count)"

$c10 = $arr | Where-Object { $_.id -eq "comp-udon-10" }
Write-Output "Comp-10: $($c10.name) | Projects: $($c10.projects.Count)"
foreach ($p in $c10.projects) {
    Write-Output "  - $($p.projectId) | $($p.siteKey) | $($p.postUrl)"
}

$c09 = $arr | Where-Object { $_.id -eq "comp-udon-09" }
Write-Output "Comp-09: $($c09.name) | Projects: $($c09.projects.Count)"
foreach ($p in $c09.projects) {
    Write-Output "  - $($p.projectId) | $($p.siteKey) | $($p.postUrl)"
}
