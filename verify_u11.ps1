[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = [System.IO.File]::ReadAllText("$PSScriptRoot/../js/data.js", [System.Text.Encoding]::UTF8)
$cleanJson = $raw -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$arr = $cleanJson | ConvertFrom-Json
$u11 = $arr | Where-Object { $_.id -eq "comp-udon-11" }
Write-Output "Company: $($u11.name) ($($u11.id))"
Write-Output "Total Projects: $($u11.projects.Count)"
Write-Output "Total Value: $($u11.totalValueMillion) MB"
Write-Output "Opportunity Score: $($u11.opportunityScore)"
foreach ($p in $u11.projects) {
    Write-Output " -> [$($p.projectId)] $($p.name) | Stage: $($p.stageKey) | Est: $($p.estValue)"
}
