[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$content = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $content -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

Write-Output "Total companies: $($companies.Count)"
foreach ($c in $companies) {
    Write-Output "[$($c.id)] $($c.name) | $($c.phone) | FB: $($c.facebookUrl)"
}
