[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 1. Load comp06 update
$updateObj = Get-Content -Path "scratch/comp06_update_2posts.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$compUpdate = $updateObj.company
$strategyJs = $updateObj.strategyJs

# 2. Load vercel_data.js
$raw = [System.IO.File]::ReadAllText("scratch/vercel_data.js", [System.Text.Encoding]::UTF8)
$cleanJson = $raw -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$arr = $cleanJson | ConvertFrom-Json
Write-Output "Loaded $($arr.Count) companies from vercel_data.js"

$replaced = $false
for ($i = 0; $i -lt $arr.Count; $i++) {
    if ($arr[$i].id -eq "comp-udon-06") {
        $arr[$i] = $compUpdate
        $replaced = $true
        Write-Output "Replaced comp-udon-06 at index $i"
        break
    }
}
if (-not $replaced) {
    $arr += $compUpdate
    Write-Output "Appended comp-udon-06"
}

$newJson = $arr | ConvertTo-Json -Depth 20
$finalDataJs = "var UDON_COMPANIES = " + $newJson + ";"
[System.IO.File]::WriteAllText("js/data.js", $finalDataJs, [System.Text.Encoding]::UTF8)
Write-Output "✅ Saved js/data.js successfully! Length: $($finalDataJs.Length)"

# 3. Update js/app.js
$appContent = [System.IO.File]::ReadAllText("js/app.js", [System.Text.Encoding]::UTF8)
if ($appContent -notmatch "'comp-udon-06':\s*\{") {
    $appContent = $appContent -replace "('comp-udon-08':\s*\{[\s\S]*?\n\s*\}\n\s*,)", "$strategyJs`n  `$1"
    if ($appContent -notmatch "'comp-udon-06':\s*\{") {
        $appContent = $appContent -replace "(\n\};\s*\n\s*if\s*\(typeof\s*window)", "`n$strategyJs`n};`n`nif (typeof window"
    }
    [System.IO.File]::WriteAllText("js/app.js", $appContent, [System.Text.Encoding]::UTF8)
    Write-Output "✅ Added comp-udon-06 strategy to js/app.js"
} else {
    Write-Output "ℹ️ comp-udon-06 already present in js/app.js"
}

# 4. Bump index.html cache buster
$indexContent = [System.IO.File]::ReadAllText("index.html", [System.Text.Encoding]::UTF8)
$newVersion = "20260918_v25"
$indexContent = $indexContent -replace "data\.js\?v=[^`"']*", "data.js?v=$newVersion"
$indexContent = $indexContent -replace "app\.js\?v=[^`"']*", "app.js?v=$newVersion"
[System.IO.File]::WriteAllText("index.html", $indexContent, [System.Text.Encoding]::UTF8)
Write-Output "✅ Bumped version in index.html to $newVersion"
