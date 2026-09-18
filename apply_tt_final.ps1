[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$updateObj = Get-Content -Path "scratch\tt_update_final.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$companyUpdate = $updateObj.company
$strategyJs = $updateObj.strategyJs

# 1. Update js/app.js
$appContent = Get-Content -Path "js\app.js" -Raw -Encoding UTF8
if ($appContent -notmatch "'comp-udon-10':\s*\{") {
    $appContent = $appContent -replace "('comp-udon-31':\s*\{[\s\S]*?\n\s*\}\n\s*,)", "$strategyJs`n  `$1"
    Set-Content -Path "js\app.js" -Value $appContent -Encoding UTF8
    Write-Output "Successfully added comp-udon-10 strategy to js/app.js"
} else {
    Write-Output "comp-udon-10 already present in js/app.js"
}

# 2. Update js/data.js
$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$updated = $false
for ($i = 0; $i -lt $companies.Count; $i++) {
    if ($companies[$i].id -eq "comp-udon-10") {
        $companies[$i] = $companyUpdate
        $updated = $true
        Write-Output "Replaced comp-udon-10 in company list."
        break
    }
}

if (-not $updated) {
    Write-Output "comp-udon-10 was not found in array, appending it..."
    $companies += $companyUpdate
}

$newJson = $companies | ConvertTo-Json -Depth 20
$finalJsContent = "var UDON_COMPANIES = " + $newJson + ";"
Set-Content -Path "js\data.js" -Value $finalJsContent -Encoding UTF8
Write-Output "Successfully updated and saved js/data.js"

# 3. Bump index.html cache buster
$indexContent = Get-Content -Path "index.html" -Raw -Encoding UTF8
$newVersion = "20260918_v17"
$indexContent = $indexContent -replace "data\.js\?v=[^`"']*", "data.js?v=$newVersion"
$indexContent = $indexContent -replace "app\.js\?v=[^`"']*", "app.js?v=$newVersion"
Set-Content -Path "index.html" -Value $indexContent -Encoding UTF8
Write-Output "Bumped version in index.html to $newVersion"
