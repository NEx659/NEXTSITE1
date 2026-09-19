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
    $oldTag = [string]$comp.tag
    $hasScg = [bool]($comp.scgCode -or $comp.scgCustomerCode)
    $projCount = 0
    if ($comp.projects) { $projCount = $comp.projects.Count }
    elseif ($comp.totalProjects) { $projCount = [int]$comp.totalProjects }
    $growthRate = 0
    if ($comp.growthRate) { $growthRate = [int]$comp.growthRate }

    # Classification logic:
    if ($hasScg -or $i -lt 10 -or $oldTag -eq 'focus' -and $projCount -ge 3) {
        $comp.tag = "strategic"
        $countStrategic++
    } elseif ($growthRate -ge 35 -or $projCount -ge 2 -or $comp.id -in @('comp-udon-54', 'comp-udon-37', 'comp-udon-58', 'comp-udon-53', 'comp-udon-32', 'comp-udon-27')) {
        $comp.tag = "growth"
        $countGrowth++
    } elseif ($projCount -gt 0 -or $oldTag -eq 'non-focus' -or $i -lt 35) {
        $comp.tag = "opportunity"
        $countOpportunity++
    } else {
        $comp.tag = "prospect"
        $countProspect++
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Updated 58 companies in data.js!"
Write-Host "Strategic: $countStrategic | Growth: $countGrowth | Opportunity: $countOpportunity | Prospect: $countProspect"
