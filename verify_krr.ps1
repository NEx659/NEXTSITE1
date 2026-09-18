[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$krr = $companies | Where-Object { $_.id -eq "comp-udon-56" }
Write-Output "Name: $($krr.name)"
Write-Output "Tag: $($krr.tag)"
Write-Output "Total Projects: $($krr.totalProjects)"
Write-Output "Projects Count: $($krr.projects.Count)"
foreach ($p in $krr.projects) {
    Write-Output "  - [$($p.stageKey)] $($p.name) (Progress: $($p.progressPercent)%)"
}
