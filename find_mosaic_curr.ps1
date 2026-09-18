$c = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $c.Substring($c.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

for ($i=0; $i -lt $companies.Count; $i++) {
    if ($companies[$i].name -like "*โมเสค*" -or $companies[$i].id -eq "comp-udon-58" -or $companies[$i].engName -like "*Mosaic*") {
        Write-Host "Found at index $i -> ID: $($companies[$i].id) | Name: $($companies[$i].name)"
        $companies[$i] | ConvertTo-Json -Depth 5 | Out-File -FilePath "c:/Users/pannipan/Downloads/N/scratch/mosaic_current.json" -Encoding utf8
    }
}
