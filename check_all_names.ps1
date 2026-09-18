$raw = Get-Content 'js/data.js' -Raw -Encoding UTF8
$jsonStr = $raw.Substring($raw.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

Write-Host "Total: $($companies.Count)"

$idx = 1
foreach ($c in $companies) {
    $hasEmpty = (-not $c.name) -or ($c.name.Trim() -eq "")
    $nameLen = if ($c.name) { $c.name.Length } else { 0 }
    if ($hasEmpty -or $nameLen -lt 5 -or $idx -le 20) {
        Write-Host "[$idx] ID: $($c.id) | NAME: '$($c.name)' | LEN: $nameLen"
    }
    if ($hasEmpty) {
        Write-Host ">>> EMPTY NAME AT INDEX $idx (ID: $($c.id)) <<<"
    }
    $idx++
}
