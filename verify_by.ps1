[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$by = $companies | Where-Object { $_.id -eq "comp-udon-31" }
Write-Output "Name: $($by.name)"
Write-Output "Tag: $($by.tag)"
Write-Output "Total Projects: $($by.totalProjects)"
Write-Output "Projects Count: $($by.projects.Count)"
foreach ($p in $by.projects) {
    Write-Output "  - [$($p.stageKey)] $($p.name) (Progress: $($p.progressPercent)%, Prov: $($p.province))"
}
