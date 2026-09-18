$newProjects = Get-Content -Raw -Encoding UTF8 "scratch/comp01_new4.json" | ConvertFrom-Json

$dataRaw = Get-Content -Raw -Encoding UTF8 "js/data.js"
if ($dataRaw.StartsWith("const companiesData = ")) {
    $dataRaw = $dataRaw.Substring("const companiesData = ".Length)
}
if ($dataRaw.EndsWith(";")) {
    $dataRaw = $dataRaw.Substring(0, $dataRaw.Length - 1)
}
$data = $dataRaw | ConvertFrom-Json

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
    $outStr = "const companiesData = " + $jsonStr + ";"
    [System.IO.File]::WriteAllText("js/data.js", $outStr, [System.Text.Encoding]::UTF8)
    Write-Output "SUCCESS: comp-udon-01 updated with 4 exact Udon Thani projects!"
} else {
    Write-Error "comp-udon-01 not found!"
}
