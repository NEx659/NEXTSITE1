$raw = Get-Content 'js/data.js' -Raw -Encoding UTF8
$jsonStr = $raw.Substring($raw.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

$idx = 1
foreach ($c in $companies) {
    Write-Host "[$idx] id: $($c.id) | name: '$($c.name)' | eng: '$($c.engName)'"
    $idx++
}
