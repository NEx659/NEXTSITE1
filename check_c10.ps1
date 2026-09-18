$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json
Write-Host "Total: $($companies.Count)"
$c10 = $companies | Where-Object { $_.id -eq "comp-udon-10" }
if ($c10) {
    Write-Host "Found comp-udon-10!"
    Write-Host "Name: $($c10.name)"
    Write-Host "Projects: $($c10.projects.Count)"
    foreach ($p in $c10.projects) {
        Write-Host " - $($p.name) => $($p.postUrl)"
    }
} else {
    Write-Host "comp-udon-10 NOT found!"
}
