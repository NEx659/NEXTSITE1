$kiddeeMariya = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/clean_kiddee_mariya.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json
$mosaic = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/clean_mosaic.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json
$piyaphat = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/piyaphat_update.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json

$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

for ($i = 0; $i -lt $companies.Count; $i++) {
    $id = $companies[$i].id
    foreach ($k in $kiddeeMariya) {
        if ($k.id -eq $id) {
            Write-Host "Directly replacing index $i -> $id ($($k.name))"
            $companies[$i] = $k
        }
    }
    if ($mosaic.id -eq $id) {
        Write-Host "Directly replacing index $i -> $id ($($mosaic.name))"
        $companies[$i] = $mosaic
    }
    if ($id -eq 'comp-udon-37') {
        Write-Host "Directly replacing index $i -> comp-udon-37 ($($piyaphat.name))"
        # preserve id
        $piyaphat.psobject.properties.add([PSVariableProperty]::new([PSVariable]::new('id', 'comp-udon-37')))
        $companies[$i] = $piyaphat
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Successfully replaced entire objects in js/data.js!"
