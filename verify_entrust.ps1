[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$entrust = $companies | Where-Object { $_.id -eq "comp-udon-57" }
Write-Output "Name: $($entrust.name)"
Write-Output "Tag: $($entrust.tag)"
Write-Output "Total Projects: $($entrust.totalProjects)"
Write-Output "Projects Count: $($entrust.projects.Count)"
foreach ($p in $entrust.projects) {
    Write-Output "  - [$($p.stageKey)] $($p.name) (Progress: $($p.progressPercent)%)"
}
