$updateData = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/pa_update.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json

$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

for ($i = 0; $i -lt $companies.Count; $i++) {
    if ($companies[$i].id -eq 'comp-udon-32') {
        Write-Host "Replacing index $i -> comp-udon-32 ($($updateData.name))"
        $updateData | Add-Member -NotePropertyName "id" -NotePropertyValue "comp-udon-32" -Force
        $companies[$i] = $updateData
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Successfully replaced comp-udon-32 object with 4 active projects!"
