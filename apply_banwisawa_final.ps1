[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$updateObj = Get-Content -Path "scratch\banwisawa_update_final.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$companyUpdate = $updateObj.company
$strategyJs = $updateObj.strategyJs

# 1. Update js/app.js
$appContent = Get-Content -Path "js\app.js" -Raw -Encoding UTF8

# Ensure comp-udon-17 strategy is in COMPANY_CUSTOM_STRATEGIES if missing
$ehouseObj = Get-Content -Path "scratch\ehouse_update_final.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$ehouseStrategy = $ehouseObj.strategyJs

if ($appContent -notmatch "'comp-udon-17':\s*\{") {
    $appContent = $appContent -replace "('comp-udon-20':\s*\{)", "$ehouseStrategy`n  `$1"
    Write-Output "Added comp-udon-17 strategy to js/app.js"
}

if ($appContent -notmatch "'comp-udon-27':\s*\{") {
    $appContent = $appContent -replace "('comp-udon-50':\s*\{)", "$strategyJs`n  `$1"
    Write-Output "Added comp-udon-27 strategy to js/app.js"
} else {
    Write-Output "comp-udon-27 already present in js/app.js"
}

Set-Content -Path "js\app.js" -Value $appContent -Encoding UTF8

# 2. Update js/data.js
$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$updated = $false
for ($i = 0; $i -lt $companies.Count; $i++) {
    if ($companies[$i].id -eq "comp-udon-27") {
        $companies[$i] = $companyUpdate
        $updated = $true
        Write-Output "Replaced comp-udon-27 in company list."
        break
    }
}

if (-not $updated) {
    Write-Output "comp-udon-27 was not found in array, appending it..."
    $companies += $companyUpdate
}

$newJson = $companies | ConvertTo-Json -Depth 20
$finalJsContent = "var UDON_COMPANIES = " + $newJson + ";"
Set-Content -Path "js\data.js" -Value $finalJsContent -Encoding UTF8
Write-Output "Successfully updated and saved js/data.js"

# 3. Bump index.html cache buster
$indexContent = Get-Content -Path "index.html" -Raw -Encoding UTF8
$newVersion = "20260918_v22"
$indexContent = $indexContent -replace "data\.js\?v=[^`"']*", "data.js?v=$newVersion"
$indexContent = $indexContent -replace "app\.js\?v=[^`"']*", "app.js?v=$newVersion"
Set-Content -Path "index.html" -Value $indexContent -Encoding UTF8
Write-Output "Bumped version in index.html to $newVersion"
