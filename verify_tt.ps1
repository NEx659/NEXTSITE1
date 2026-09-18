[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$tt = $companies | Where-Object { $_.id -eq "comp-udon-10" }
Write-Output "Name: $($tt.name)"
Write-Output "Tag: $($tt.tag)"
Write-Output "Total Projects: $($tt.totalProjects)"
Write-Output "Projects Count: $($tt.projects.Count)"
foreach ($p in $tt.projects) {
    Write-Output "  - [$($p.stageKey)] $($p.name) (Progress: $($p.progressPercent)%)"
}
