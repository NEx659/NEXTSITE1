[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$nasitJson = Get-Content -Path "scratch\nasit_update_final.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$comp09 = $nasitJson.company

$dataJs = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataJs -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

$updated = $false
for ($i = 0; $i -lt $companies.Count; $i++) {
    if ($companies[$i].id -eq "comp-udon-09") {
        $companies[$i] = $comp09
        $updated = $true
        Write-Output "Successfully updated comp-udon-09 in companies array at index $i."
        break
    }
}

if (-not $updated) {
    Write-Output "comp-udon-09 not found, appending..."
    $companies += $comp09
}

$newJson = $companies | ConvertTo-Json -Depth 20
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"
Set-Content -Path "js\data.js" -Value $finalJs -Encoding UTF8
Write-Output "Successfully saved js/data.js with $($companies.Count) companies."

# Bump index.html cache buster
$indexContent = Get-Content -Path "index.html" -Raw -Encoding UTF8
$newVersion = "20260918_v25"
$indexContent = $indexContent -replace "data\.js\?v=[^`"']*", "data.js?v=$newVersion"
$indexContent = $indexContent -replace "app\.js\?v=[^`"']*", "app.js?v=$newVersion"
Set-Content -Path "index.html" -Value $indexContent -Encoding UTF8
Write-Output "Bumped version in index.html to $newVersion"
