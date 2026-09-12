$dataRaw = Get-Content -Raw -Encoding UTF8 ./js/data.js
$idx = $dataRaw.IndexOf('[')
$prefix = $dataRaw.Substring(0, $idx)
$json = $dataRaw.Substring($idx)
$companies = ConvertFrom-Json $json

$mapList = Get-Content -Raw -Encoding UTF8 ./scratch/user_provided_maps.json | ConvertFrom-Json

Write-Host "Total companies in dataset: $($companies.Count)"
Write-Host "Total user provided maps: $($mapList.Count)"

$matchCount = 0

foreach ($item in $mapList) {
    $q = $item.query.Trim()
    $cleanQ = $q -replace 'บริษัท|จำกัด|ห้างหุ้นส่วน|หจก\.|หจก|\(TSIC\s*\d+\)|\s+', ''
    
    $matched = $false
    foreach ($c in $companies) {
        $cName = $c.name.Trim()
        $cleanC = $cName -replace 'บริษัท|จำกัด|ห้างหุ้นส่วน|หจก\.|หจก|\(TSIC\s*\d+\)|\s+', ''
        
        $cEng = if ($c.engName) { $c.engName.Trim() } else { "" }
        
        if ($cName.Contains($q) -or $q.Contains($cName) -or $cleanC.Contains($cleanQ) -or $cleanQ.Contains($cleanC)) {
            $matched = $true
            $c.googleMapsUrl = $item.mapsUrl
            if ($item.address) {
                $c.address = $item.address
            }
            Write-Host "SUCCESS MATCH: '$q' => '$cName' (ID: $($c.id))"
            $matchCount++
            break
        }
    }
    
    if (-not $matched) {
        Write-Host "NOT FOUND: '$q'" -ForegroundColor Yellow
    }
}

Write-Host "Total matched: $matchCount / $($mapList.Count)"

# Save back to js/data.js
$newJson = $companies | ConvertTo-Json -Depth 10
$finalContent = $prefix + $newJson
[System.IO.File]::WriteAllText("$PWD/js/data.js", $finalContent, [System.Text.Encoding]::UTF8)
Write-Host "Updated js/data.js successfully!"
