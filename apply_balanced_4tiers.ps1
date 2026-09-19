$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

$countStrategic = 0
$countGrowth = 0
$countOpportunity = 0
$countProspect = 0

for ($i = 0; $i -lt $companies.Count; $i++) {
    $comp = $companies[$i]
    $hasScg = [bool]($comp.scgCode -or $comp.scgCustomerCode)
    
    $tagVal = "prospect"
    if ($hasScg -or $i -lt 12) {
        $tagVal = "strategic"
        $countStrategic++
    } elseif ($i -lt 28 -or $comp.id -in @('comp-udon-54', 'comp-udon-37', 'comp-udon-58', 'comp-udon-53', 'comp-udon-32', 'comp-udon-27', 'comp-udon-21', 'comp-udon-41')) {
        $tagVal = "growth"
        $countGrowth++
    } elseif ($i -lt 45) {
        $tagVal = "opportunity"
        $countOpportunity++
    } else {
        $tagVal = "prospect"
        $countProspect++
    }

    $comp | Add-Member -NotePropertyName "tag" -NotePropertyValue $tagVal -Force
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Updated 58 companies with balanced 4-tier distribution!"
Write-Host "Strategic: $countStrategic | Growth: $countGrowth | Opportunity: $countOpportunity | Prospect: $countProspect"
