$updateData = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/mosaic_update.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json

$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

for ($i = 0; $i -lt $companies.Count; $i++) {
    if ($companies[$i].id -eq 'comp-udon-58') {
        Write-Host "Updating index $i -> comp-udon-58 ($($updateData.name))"
        $companies[$i].name = $updateData.name
        $companies[$i].engName = $updateData.engName
        $companies[$i].category = $updateData.category
        $companies[$i].province = $updateData.province
        $companies[$i].district = $updateData.district
        $companies[$i].address = $updateData.address
        $companies[$i].phone = $updateData.phone
        $companies[$i].contactPerson = $updateData.contactPerson
        $companies[$i].totalProjects = $updateData.totalProjects
        $companies[$i].newProjectsThisMonth = $updateData.newProjectsThisMonth
        $companies[$i].totalValueMillion = $updateData.totalValueMillion
        $companies[$i].growthRate = $updateData.growthRate
        $companies[$i].areaExpansion = $updateData.areaExpansion
        $companies[$i].revenuePotentialText = $updateData.revenuePotentialText
        $companies[$i].latestTimelineStage = $updateData.latestTimelineStage
        $companies[$i].coordinates = $updateData.coordinates
        $companies[$i].googleMapsUrl = $updateData.googleMapsUrl
        $companies[$i].gmaps = $updateData.gmaps
        $companies[$i].facebookUrl = $updateData.facebookUrl
        $companies[$i].verificationStatus = $updateData.verificationStatus
        $companies[$i].stageBreakdown = $updateData.stageBreakdown
        $companies[$i].facebookSignal = $updateData.facebookSignal
        $companies[$i].salesActionPlan = $updateData.salesActionPlan
        $companies[$i].projects = $updateData.projects
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Successfully saved comp-udon-58 (Mosaic Design) with 2 active projects!"
