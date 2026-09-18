$dataRaw = Get-Content -Raw -Encoding UTF8 "js/data.js"
$prefix = "var UDON_COMPANIES = "
$trimmed = $dataRaw.Trim()
$json = $trimmed.Substring($prefix.Length).Trim().TrimEnd(';').Trim()
$obj = $json | ConvertFrom-Json

$tt = $obj | Where-Object { $_.id -eq "comp-udon-10" }
Write-Host "Company: $($tt.name)"
Write-Host "Total projects: $($tt.projects.Count)"
foreach ($p in $tt.projects) {
    Write-Host "--------------------------------------------------"
    Write-Host "ID: $($p.projectId)"
    Write-Host "siteKey: $($p.siteKey)"
    Write-Host "Name: $($p.name)"
    Write-Host "Location: $($p.location)"
    Write-Host "Stage: $($p.stage)"
    Write-Host "Direct URL: $($p.postUrl)"
}
