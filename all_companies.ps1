[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$content = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $content -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

for ($i = 0; $i -lt $companies.Count; $i++) {
    $c = $companies[$i]
    Write-Output "[$($c.id)] $($c.name)"
}
