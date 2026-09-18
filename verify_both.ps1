$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
foreach ($id in @("comp-udon-51", "comp-udon-12")) {
    $item = $dataList | Where-Object { $_.id -eq $id }
    Write-Output ("ID: " + $item.id + " | Name: " + $item.name + " | Tag: " + $item.tag + " | Projects: " + $item.projects.Count)
    foreach ($p in $item.projects) {
        Write-Output ("   - " + $p.name + " (" + $p.stageKey + ", " + $p.progressPercent + "%)")
    }
}
