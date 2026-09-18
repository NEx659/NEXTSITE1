[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$updateObj = Get-Content -Path "scratch\ct_update.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$companyUpdate = $updateObj.company
$strategyJs = $updateObj.strategyJs

# 1. Update js/app.js
$appContent = Get-Content -Path "js\app.js" -Raw -Encoding UTF8
if ($appContent -notmatch "'comp-udon-42':\s*\{") {
    $appContent = $appContent -replace "('comp-udon-57':\s*\{[\s\S]*?\n\s*\}\n\s*,)", "$strategyJs`n  `$1"
    Set-Content -Path "js\app.js" -Value $appContent -Encoding UTF8
    Write-Output "Successfully updated js/app.js with comp-udon-42"
} else {
    Write-Output "comp-udon-42 already present in js/app.js"
}

# 2. Update js/data.js
$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

for ($i = 0; $i -lt $companies.Count; $i++) {
    if ($companies[$i].id -eq "comp-udon-42") {
        $companies[$i] = $companyUpdate
        Write-Output "Replaced comp-udon-42 in company list."
        break
    }
}

$newJson = $companies | ConvertTo-Json -Depth 15
$finalJsContent = "var UDON_COMPANIES = " + $newJson + ";"
Set-Content -Path "js\data.js" -Value $finalJsContent -Encoding UTF8
Write-Output "Successfully updated and saved js/data.js"
