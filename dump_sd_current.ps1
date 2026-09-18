$c = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $c.Substring($c.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

$sd = $null
foreach ($comp in $companies) {
    if ($comp.id -eq 'comp-udon-53') {
        $sd = $comp
        break
    }
}

$sd | ConvertTo-Json -Depth 5 | Out-File -FilePath "c:/Users/pannipan/Downloads/N/scratch/sd_current.json" -Encoding utf8
Write-Host "Saved current comp-udon-53 to sd_current.json"
