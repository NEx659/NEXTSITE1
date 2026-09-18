$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
$item = $dataList | Where-Object { $_.id -eq "comp-udon-48" }
Write-Output ("ID: " + $item.id)
Write-Output ("Name: " + $item.name)
Write-Output ("Tag: " + $item.tag)
Write-Output ("Total Projects: " + $item.totalProjects)
Write-Output ("Contacts: " + $item.contactPerson)
Write-Output ("Projects count: " + $item.projects.Count)
foreach ($p in $item.projects) {
    Write-Output (" - " + $p.name + " (" + $p.stageKey + ", " + $p.progressPercent + "%)")
}
