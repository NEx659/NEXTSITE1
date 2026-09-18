[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 1. Load UD Home update
$updateObj = Get-Content -Path "scratch/udhome_update_udon_only.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$compUpdate = $updateObj.company
$strategyJs = $updateObj.strategyJs

# 2. Update js/data.js
$raw = [System.IO.File]::ReadAllText("js/data.js", [System.Text.Encoding]::UTF8)
$cleanJson = $raw -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$arr = $cleanJson | ConvertFrom-Json
Write-Output "Loaded $($arr.Count) companies from js/data.js"

$replaced = $false
for ($i = 0; $i -lt $arr.Count; $i++) {
    if ($arr[$i].id -eq "comp-udon-11") {
        $arr[$i] = $compUpdate
        $replaced = $true
        Write-Output "Replaced comp-udon-11 with 5 Udon Thani projects at index $i"
        break
    }
}
if (-not $replaced) {
    $arr += $compUpdate
    Write-Output "Appended comp-udon-11"
}

$newJson = $arr | ConvertTo-Json -Depth 20
$finalDataJs = "var UDON_COMPANIES = " + $newJson + ";"
[System.IO.File]::WriteAllText("js/data.js", $finalDataJs, [System.Text.Encoding]::UTF8)
Write-Output "✅ Saved updated js/data.js successfully!"

# 3. Update js/app.js
$appContent = [System.IO.File]::ReadAllText("js/app.js", [System.Text.Encoding]::UTF8)
if ($appContent -match "'comp-udon-11':\s*\{[\s\S]*?\n\s*\},") {
    $appContent = $appContent -replace "'comp-udon-11':\s*\{[\s\S]*?\n\s*\},", $strategyJs
    [System.IO.File]::WriteAllText("js/app.js", $appContent, [System.Text.Encoding]::UTF8)
    Write-Output "✅ Updated comp-udon-11 strategy in js/app.js"
} else {
    $appContent = $appContent -replace "('comp-udon-06':\s*\{[\s\S]*?\n\s*\}\n\s*,)", "$strategyJs`n  `$1"
    [System.IO.File]::WriteAllText("js/app.js", $appContent, [System.Text.Encoding]::UTF8)
    Write-Output "✅ Added comp-udon-11 strategy to js/app.js"
}

# 4. Bump index.html & NEX SAKON.html
$indexContent = [System.IO.File]::ReadAllText("index.html", [System.Text.Encoding]::UTF8)
$newVersion = "20260918_v27"
$indexContent = $indexContent -replace "data\.js\?v=[^`"']*", "data.js?v=$newVersion"
$indexContent = $indexContent -replace "app\.js\?v=[^`"']*", "app.js?v=$newVersion"
[System.IO.File]::WriteAllText("index.html", $indexContent, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("NEX SAKON.html", $indexContent, [System.Text.Encoding]::UTF8)
Write-Output "✅ Bumped version in index.html and NEX SAKON.html to $newVersion"
