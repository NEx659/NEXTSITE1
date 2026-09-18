$content = Get-Content -Raw -Encoding UTF8 "$pwd/js/data.js"
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

Write-Host "TOTAL COMPANIES: $($companies.Count)"

$grouped = $companies | Group-Object -Property province

foreach ($g in $grouped) {
    Write-Host "Province: $($g.Name) -> Count: $($g.Count)"
    if ($g.Name -ne $companies[0].province) {
        foreach ($item in $g.Group) {
            Write-Host "   NON-MAIN: ID=$($item.id) Name=$($item.name)"
        }
    }
}
