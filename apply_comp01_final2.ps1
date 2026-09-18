$newProjects = Get-Content -Raw -Encoding UTF8 "scratch/comp01_new4.json" | ConvertFrom-Json

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

$data = $jsonText | ConvertFrom-Json

$found = $false
for ($i = 0; $i -lt $data.Count; $i++) {
    if ($data[$i].id -eq "comp-udon-01") {
        $data[$i].projects = $newProjects
        $data[$i].totalProjects = 4
        $data[$i].newProjectsThisMonth = 4
        $data[$i].totalValueMillion = 21.4
        $found = $true
        break
    }
}

if ($found) {
    $jsonStr = $data | ConvertTo-Json -Depth 20
    $outStr = "var UDON_COMPANIES = " + $jsonStr + ";"
    [System.IO.File]::WriteAllText("js/data.js", $outStr, [System.Text.Encoding]::UTF8)
    Write-Output "SUCCESS: comp-udon-01 updated with 4 exact Udon Thani projects in js/data.js!"
} else {
    Write-Error "comp-udon-01 not found in data array!"
}
