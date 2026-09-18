[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = Get-Content 'js/data.js' -Raw -Encoding UTF8
$cleaned = $raw -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$obj = ConvertFrom-Json $cleaned
$b = $obj | Where-Object { $_.id -eq 'comp-udon-52' }
Write-Output "Found: $($b.name)"
Write-Output "Projects count: $($b.projects.Count)"
foreach ($p in $b.projects) {
    Write-Output "  - ID: $($p.projectId) | siteKey: $($p.siteKey) | Name: $($p.name)"
    Write-Output "    URL: $($p.postUrl)"
}
