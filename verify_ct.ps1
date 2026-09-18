[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$ct = $companies | Where-Object { $_.id -eq "comp-udon-42" }
Write-Output "Name: $($ct.name)"
Write-Output "Tag: $($ct.tag)"
Write-Output "Total Projects: $($ct.totalProjects)"
Write-Output "Projects Count: $($ct.projects.Count)"
foreach ($p in $ct.projects) {
    Write-Output "  - [$($p.stageKey)] $($p.name) (Progress: $($p.progressPercent)%)"
}
