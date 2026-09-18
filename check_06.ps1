$c = Get-Content -Raw -Encoding UTF8 'js/data.js'
$jsonText = $c -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$data = $jsonText | ConvertFrom-Json
$comp = $data | Where-Object { $_.id -eq 'comp-udon-06' }
Write-Output "Found in data.js: $($comp.name) ($($comp.id))"
Write-Output "Page: $($comp.facebookPageUrl)"
Write-Output "Projects count: $($comp.projects.Count)"
$comp | ConvertTo-Json -Depth 6 | Out-File -Encoding UTF8 'scratch/comp06_current.json'

# Search in dataset.json for posts of this company
if (Test-Path 'scratch/dataset.json') {
    Write-Output "Checking dataset.json..."
}
