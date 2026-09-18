$fixes = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/fixes_array.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json

$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

for ($i = 0; $i -lt $companies.Count; $i++) {
    foreach ($f in $fixes) {
        if ($companies[$i].id -eq $f.id) {
            Write-Host "Index $i matched $($f.id) -> Setting name to $($f.name)"
            $companies[$i].name = $f.name
            $companies[$i].engName = $f.engName
            $companies[$i].category = $f.category
            $companies[$i].province = $f.province
            $companies[$i].district = $f.district
            $companies[$i].address = $f.address
            $companies[$i].phone = $f.phone
            $companies[$i].contactPerson = $f.contactPerson
        }
    }
}

# Verify
for ($i = 0; $i -lt $companies.Count; $i++) {
    if (-not $companies[$i].name -or $companies[$i].name.Trim() -eq '') {
        Write-Host "ERROR: Empty name at index $i (id: $($companies[$i].id))"
    } else {
        if ($companies[$i].id -in @('comp-udon-41', 'comp-udon-21', 'comp-udon-58')) {
            Write-Host "VERIFIED: $($companies[$i].id) => '$($companies[$i].name)'"
        }
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Saved js/data.js successfully!"
