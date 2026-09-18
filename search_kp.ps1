[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$content = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $content -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

Write-Output "Total: $($companies.Count)"
for ($i = 0; $i -lt $companies.Count; $i++) {
    $c = $companies[$i]
    if ($c.name -like "*เค*" -or $c.name -like "*KP*" -or $c.name -like "*เค พี*" -or $c.engName -like "*KP*" -or $c.id -like "*kp*") {
        Write-Output "MATCH: [$($c.id)] $($c.name) | $($c.engName) | Phone: $($c.phone) | FB: $($c.facebookUrl)"
    }
}
