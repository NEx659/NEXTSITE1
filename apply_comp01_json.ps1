$comp01_raw = [System.IO.File]::ReadAllText("c:\Users\pannipan\Downloads\N\scratch\comp01_exact4.json", [System.Text.Encoding]::UTF8)
$comp01_obj = $comp01_raw | ConvertFrom-Json

$data_raw = [System.IO.File]::ReadAllText("c:\Users\pannipan\Downloads\N\js\data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $data_raw -replace '^\s*(var|let|const|window\.)?\s*UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$data = $jsonStr | ConvertFrom-Json

$found = $false
for ($i = 0; $i -lt $data.Count; $i++) {
    if ($data[$i].id -eq "comp-udon-01") {
        $data[$i] = $comp01_obj
        $found = $true
        break
    }
}

if ($found) {
    $newJson = $data | ConvertTo-Json -Depth 10
    $finalContent = "var UDON_COMPANIES = " + $newJson + ";"
    [System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\data.js", $finalContent, [System.Text.Encoding]::UTF8)
    Write-Output "Successfully updated comp-udon-01 in js/data.js!"
} else {
    Write-Error "comp-udon-01 not found!"
}
