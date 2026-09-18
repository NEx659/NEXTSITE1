# 1. Restore comp-udon-01 in js/data.js from comp01_current.json
$origComp = Get-Content -Raw -Encoding UTF8 "scratch/comp01_current.json" | ConvertFrom-Json

$dataRaw = Get-Content -Raw -Encoding UTF8 "js/data.js"
$prefix = "var UDON_COMPANIES = "
$suffix = ";"

$trimmed = $dataRaw.Trim()
if ($trimmed.StartsWith($prefix)) {
    $jsonText = $trimmed.Substring($prefix.Length)
    if ($jsonText.EndsWith($suffix)) {
        $jsonText = $jsonText.Substring(0, $jsonText.Length - $suffix.Length).Trim()
    }
}

$data = $jsonText | ConvertFrom-Json

for ($i = 0; $i -lt $data.Count; $i++) {
    if ($data[$i].id -eq "comp-udon-01") {
        $data[$i] = $origComp
        break
    }
}

$jsonStr = $data | ConvertTo-Json -Depth 25
$outStr = "var UDON_COMPANIES = " + $jsonStr + ";"
[System.IO.File]::WriteAllText("js/data.js", $outStr, [System.Text.Encoding]::UTF8)
Write-Output "Restored comp-udon-01 to original state successfully!"
