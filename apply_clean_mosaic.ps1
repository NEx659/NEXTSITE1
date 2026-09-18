$mosaic = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/clean_mosaic.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json

$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

for ($i = 0; $i -lt $companies.Count; $i++) {
    if ($companies[$i].id -eq 'comp-udon-58') {
        Write-Host "Updating index $i -> comp-udon-58 ($($mosaic.name))"
        $companies[$i].name = $mosaic.name
        $companies[$i].engName = $mosaic.engName
        $companies[$i].category = $mosaic.category
        $companies[$i].province = $mosaic.province
        $companies[$i].district = $mosaic.district
        $companies[$i].address = $mosaic.address
        $companies[$i].phone = $mosaic.phone
        $companies[$i].contactPerson = $mosaic.contactPerson
        $companies[$i].areaExpansion = $mosaic.areaExpansion
        $companies[$i].revenuePotentialText = $mosaic.revenuePotentialText
        $companies[$i].facebookSignal = $mosaic.facebookSignal
        $companies[$i].salesActionPlan = $mosaic.salesActionPlan
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Successfully saved clean comp-udon-58!"
