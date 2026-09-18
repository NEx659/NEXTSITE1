$updateObj = Get-Content -Encoding UTF8 -Path "scratch/comp32_update.json" -Raw | ConvertFrom-Json
$dataContent = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $dataContent -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json

$found = $false
for ($i = 0; $i -lt $dataList.Count; $i++) {
    if ($dataList[$i].id -eq "comp-udon-32") {
        $dataList[$i] = $updateObj
        $found = $true
        break
    }
}

if ($found) {
    $outJson = $dataList | ConvertTo-Json -Depth 20
    $finalContent = "var UDON_COMPANIES = " + $outJson + ";"
    [System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\data.js", $finalContent, [System.Text.Encoding]::UTF8)
    Write-Output "Successfully updated js/data.js for comp-udon-32"
} else {
    Write-Error "comp-udon-32 not found in js/data.js"
}
