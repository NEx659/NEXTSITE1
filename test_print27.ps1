[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content -Raw -Encoding UTF8 'js/data.js'
$clean = $raw -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$data = $clean | ConvertFrom-Json
$c = $data | Where-Object { $_.id -eq 'comp-udon-27' }
Write-Output "COMP: $($c.name)"
Write-Output "COUNT: $($c.projects.Count)"
foreach ($p in $c.projects) {
    Write-Output " - [$($p.siteKey)] $($p.name)"
    Write-Output "   URL: $($p.postUrl)"
}
