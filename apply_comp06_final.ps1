[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$updateObj = Get-Content -Path "scratch/comp06_update_2posts.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$companyUpdate = $updateObj.company
$strategyJs = $updateObj.strategyJs

# 1. Update js/app.js
$appContent = Get-Content -Path "js/app.js" -Raw -Encoding UTF8
if ($appContent -notmatch "'comp-udon-06':\s*\{") {
    $appContent = $appContent -replace "('comp-udon-08':\s*\{[\s\S]*?\n\s*\}\n\s*,)", "$strategyJs`n  `$1"
    if ($appContent -notmatch "'comp-udon-06':\s*\{") {
        # append before closing brace
        $appContent = $appContent -replace "(\n\};\s*\n\s*if\s*\(typeof\s*window)", "`n$strategyJs`n};`n`nif (typeof window"
    }
    Set-Content -Path "js/app.js" -Value $appContent -Encoding UTF8
    Write-Output "Successfully added comp-udon-06 strategy to js/app.js"
} else {
    Write-Output "comp-udon-06 already present in js/app.js"
}

# 2. Update js/data.js
$dataRaw = Get-Content -Raw -Encoding UTF8 "js/data.js"
$prefix = "var UDON_COMPANIES = "
$suffix = ";"

$trimmed = $dataRaw.Trim()
if ($trimmed.StartsWith($prefix)) {
    $jsonText = $trimmed.Substring($prefix.Length)
    if ($jsonText.EndsWith($suffix)) {
        $jsonText = $jsonText.Substring(0, $jsonText.Length - $suffix.Length).Trim()
    }
} else {
    Write-Error "Prefix not matched!"
    exit 1
}

$companies = $jsonText | ConvertFrom-Json

$updated = $false
for ($i = 0; $i -lt $companies.Count; $i++) {
    if ($companies[$i].id -eq "comp-udon-06") {
        $companies[$i] = $companyUpdate
        $updated = $true
        Write-Output "Replaced comp-udon-06 in company list."
        break
    }
}

if (-not $updated) {
    Write-Output "comp-udon-06 was not found in array, appending it..."
    $companies += $companyUpdate
}

$newJson = $companies | ConvertTo-Json -Depth 20
$finalJsContent = "var UDON_COMPANIES = " + $newJson + ";"
[System.IO.File]::WriteAllText("js/data.js", $finalJsContent, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated and saved js/data.js"

# 3. Bump index.html cache buster
$indexContent = Get-Content -Path "index.html" -Raw -Encoding UTF8
$newVersion = "20260918_v24"
$indexContent = $indexContent -replace "data\.js\?v=[^`"']*", "data.js?v=$newVersion"
$indexContent = $indexContent -replace "app\.js\?v=[^`"']*", "app.js?v=$newVersion"
Set-Content -Path "index.html" -Value $indexContent -Encoding UTF8
Write-Output "Bumped version in index.html to $newVersion"
