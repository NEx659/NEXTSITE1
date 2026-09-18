$updateData = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/si_update_data.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json

$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

$comp = $companies | Where-Object { $_.id -eq 'comp-udon-54' }
if (-not $comp) {
    Write-Error "comp-udon-54 not found!"
    exit 1
}

Write-Host "Updating comp-udon-54..."

$comp.name = $updateData.name
$comp.engName = $updateData.engName
$comp.category = $updateData.category
$comp.province = $updateData.province
$comp.district = $updateData.district
$comp.address = $updateData.address
$comp.phone = $updateData.phone
$comp.contactPerson = $updateData.contactPerson
$comp.totalProjects = $updateData.totalProjects
$comp.newProjectsThisMonth = $updateData.newProjectsThisMonth
$comp.totalValueMillion = $updateData.totalValueMillion
$comp.growthRate = $updateData.growthRate
$comp.areaExpansion = $updateData.areaExpansion
$comp.revenuePotentialText = $updateData.revenuePotentialText
$comp.latestTimelineStage = $updateData.latestTimelineStage
$comp.verificationStatus = $updateData.verificationStatus
$comp.stageBreakdown = $updateData.stageBreakdown
$comp.facebookSignal = $updateData.facebookSignal
$comp.projects = $updateData.projects

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Successfully updated comp-udon-54 in js/data.js with 5 projects!"
