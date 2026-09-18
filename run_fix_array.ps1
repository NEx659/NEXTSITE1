$fixes = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/fixes_array.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json

$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

foreach ($f in $fixes) {
    $comp = $companies | Where-Object { $_.id -eq $f.id }
    if ($comp) {
        Write-Host "Updating $($f.id) -> $($f.name)"
        $comp.name = $f.name
        $comp.engName = $f.engName
        $comp.category = $f.category
        $comp.province = $f.province
        $comp.district = $f.district
        $comp.address = $f.address
        $comp.phone = $f.phone
        $comp.contactPerson = $f.contactPerson
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Saved js/data.js!"
