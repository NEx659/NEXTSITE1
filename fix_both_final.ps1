[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 1. Load clean TT (comp-udon-10) and clean Nasit (comp-udon-09)
$ttJson = Get-Content -Path "scratch\tt_update_final.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$comp10 = $ttJson.company

$nasitJson = Get-Content -Path "scratch\nasit_update_final.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$comp09 = $nasitJson.company
$strategy09 = $nasitJson.strategyJs

# Let's inspect js/data.js lines and reconstruct the array of companies cleanly.
# We can read js/data.js and slice out each company object by parsing top-level objects,
# or we can read all companies except comp-udon-10 and comp-udon-09.

$dataJs = Get-Content -Path "js\data.js" -Raw -Encoding UTF8

# Notice the corruption was between:
# "boq":  [\s*\{[\s\S]*?"id":  "comp-udon-09" ... าสน์ 800 ตร.ม. กระจายตัวทั่ว จ.อุดรธานี",
# Let's fix that section in $dataJs directly with replace or we can parse.

# Let's do a regex fix for the broken comp-udon-10 in dataJs:
# From `"id":  "comp-udon-10",` down to `"sales2026":  3396188.25\s*\}`
$comp10CleanJson = ($comp10 | ConvertTo-Json -Depth 20)
# format nicely
$comp09CleanJson = ($comp09 | ConvertTo-Json -Depth 20)

# Let's see: we can replace the entire comp-udon-10 block
$pattern10 = '\{\s*"id":\s*"comp-udon-10"[\s\S]*?"scgCode":\s*"10482913"[\s\S]*?\}'
if ($dataJs -match $pattern10) {
    Write-Output "Matched comp-udon-10 block to replace."
    $dataJs = [regex]::Replace($dataJs, $pattern10, $comp10CleanJson)
} else {
    Write-Output "WARNING: Could not match comp-udon-10 pattern!"
}

# Now let's replace comp-udon-09 block:
$pattern09 = '\{\s*"id":\s*"comp-udon-09"[\s\S]*?"scgCode":\s*"10503273"[\s\S]*?\}'
if ($dataJs -match $pattern09) {
    Write-Output "Matched comp-udon-09 block to replace."
    $dataJs = [regex]::Replace($dataJs, $pattern09, $comp09CleanJson)
} else {
    Write-Output "WARNING: Could not match comp-udon-09 pattern!"
}

Set-Content -Path "js\data.js" -Value $dataJs -Encoding UTF8
Write-Output "Updated js/data.js text."

# Now let's test if ConvertFrom-Json parses the whole array
$cleanJson = $dataJs -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
try {
    $parsed = $cleanJson | ConvertFrom-Json
    Write-Output "SUCCESS! Successfully parsed all $($parsed.Count) companies!"
    
    # Save back formatted cleanly
    $finalJs = "var UDON_COMPANIES = " + ($parsed | ConvertTo-Json -Depth 20) + ";"
    Set-Content -Path "js\data.js" -Value $finalJs -Encoding UTF8
    Write-Output "Formatted and verified data.js."
} catch {
    Write-Error "JSON parse error: $_"
}

# Update app.js
$appJs = Get-Content -Path "js\app.js" -Raw -Encoding UTF8
if ($appJs -notmatch "'comp-udon-09':\s*\{") {
    $appJs = $appJs -replace "('comp-udon-50':\s*\{[\s\S]*?\n\s*\}\n\s*,)", "$strategy09`n  `$1"
    if ($appJs -notmatch "'comp-udon-09':\s*\{") {
        $appJs = $appJs -replace "(\n\};\s*\n\s*if\s*\(typeof\s*window)", "$strategy09`n};`n`nif (typeof window"
    }
    Set-Content -Path "js\app.js" -Value $appJs -Encoding UTF8
    Write-Output "Added comp-udon-09 strategy to js/app.js"
} else {
    # Replace existing comp-udon-09 strategy
    $strategyRegex = "'comp-udon-09':\s*\{[\s\S]*?\n\s*\}"
    $appJs = [regex]::Replace($appJs, $strategyRegex, $strategy09.TrimEnd(','))
    Set-Content -Path "js\app.js" -Value $appJs -Encoding UTF8
    Write-Output "Updated comp-udon-09 strategy in js/app.js"
}

# Update index.html
$indexContent = Get-Content -Path "index.html" -Raw -Encoding UTF8
$newVersion = "20260918_v25"
$indexContent = $indexContent -replace "data\.js\?v=[^`"']*", "data.js?v=$newVersion"
$indexContent = $indexContent -replace "app\.js\?v=[^`"']*", "app.js?v=$newVersion"
Set-Content -Path "index.html" -Value $indexContent -Encoding UTF8
Write-Output "Bumped version in index.html to $newVersion"
