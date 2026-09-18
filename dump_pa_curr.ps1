$c = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $c.Substring($c.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

$pa = $null
foreach ($comp in $companies) {
    if ($comp.id -eq 'comp-udon-32') {
        $pa = $comp
        break
    }
}

$pa | ConvertTo-Json -Depth 5 | Out-File -FilePath "c:/Users/pannipan/Downloads/N/scratch/pa_current.json" -Encoding utf8
Write-Host "Saved current comp-udon-32 to pa_current.json"
Write-Host "FB URL: $($pa.facebookUrl)"
Write-Host "Phone: $($pa.phone)"
