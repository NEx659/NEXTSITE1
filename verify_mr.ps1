[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$mr = $companies | Where-Object { $_.id -eq "comp-udon-05" }
Write-Output "Name: $($mr.name)"
Write-Output "Tag: $($mr.tag)"
Write-Output "Total Projects: $($mr.totalProjects)"
Write-Output "Projects Count: $($mr.projects.Count)"
foreach ($p in $mr.projects) {
    Write-Output "  - [$($p.stageKey)] $($p.name) (Progress: $($p.progressPercent)%)"
}
