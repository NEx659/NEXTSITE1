$fixData = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/fix_names.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json

$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

foreach ($prop in $fixData.psobject.Properties) {
    $id = $prop.Name
    $val = $prop.Value
    $comp = $companies | Where-Object { $_.id -eq $id }
    if ($comp) {
        Write-Host "Updating $($id) -> $($val.name)..."
        $comp.name = $val.name
        $comp.engName = $val.engName
        $comp.category = $val.category
        $comp.province = $val.province
        $comp.district = $val.district
        $comp.address = $val.address
        $comp.phone = $val.phone
        $comp.contactPerson = $val.contactPerson
    }
}

# Verify all 58 companies have valid names
$emptyCount = 0
foreach ($c in $companies) {
    if (-not $c.name -or $c.name.Trim() -eq '') {
        Write-Host "Warning: Empty name on $($c.id)"
        $emptyCount++
    }
}
Write-Host "Total empty names: $emptyCount"

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Successfully saved js/data.js with clean names!"
