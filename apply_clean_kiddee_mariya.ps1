$cleanData = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/clean_kiddee_mariya.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json

$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

for ($i = 0; $i -lt $companies.Count; $i++) {
    foreach ($item in $cleanData) {
        if ($companies[$i].id -eq $item.id) {
            Write-Host "Updating index $i -> $($item.id) ($($item.name))"
            $companies[$i].name = $item.name
            $companies[$i].engName = $item.engName
            $companies[$i].category = $item.category
            $companies[$i].province = $item.province
            $companies[$i].district = $item.district
            $companies[$i].address = $item.address
            $companies[$i].phone = $item.phone
            $companies[$i].contactPerson = $item.contactPerson
            $companies[$i].totalProjects = $item.totalProjects
            $companies[$i].newProjectsThisMonth = $item.newProjectsThisMonth
            $companies[$i].totalValueMillion = $item.totalValueMillion
            $companies[$i].growthRate = $item.growthRate
            $companies[$i].areaExpansion = $item.areaExpansion
            $companies[$i].revenuePotentialText = $item.revenuePotentialText
            $companies[$i].latestTimelineStage = $item.latestTimelineStage
            $companies[$i].verificationStatus = $item.verificationStatus
            $companies[$i].stageBreakdown = $item.stageBreakdown
            $companies[$i].facebookSignal = $item.facebookSignal
            $companies[$i].projects = $item.projects
            
            # Clean up extra mojibake properties if any
            if ($companies[$i].aiRecommendation) {
                $companies[$i].psobject.properties.remove('aiRecommendation')
            }
            if ($companies[$i].customDiagnostic) {
                $companies[$i].psobject.properties.remove('customDiagnostic')
            }
            if ($companies[$i].customRecommendations) {
                $companies[$i].psobject.properties.remove('customRecommendations')
            }
            if ($companies[$i].aiShortRec) {
                $companies[$i].psobject.properties.remove('aiShortRec')
            }
        }
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Successfully cleaned and saved js/data.js!"
