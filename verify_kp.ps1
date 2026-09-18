[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$kp = $companies | Where-Object { $_.id -eq "comp-udon-20" }
Write-Output "KP Name: $($kp.name)"
Write-Output "KP Tag: $($kp.tag)"
Write-Output "KP TotalProjects: $($kp.totalProjects)"
Write-Output "KP Projects Count: $($kp.projects.Count)"
foreach ($p in $kp.projects) {
    Write-Output "  - [$($p.stageKey)] $($p.name) ($($p.progressPercent)%)"
}
