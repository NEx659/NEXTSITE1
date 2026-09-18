Add-Type -AssemblyName System.Web.Extensions
$raw = [System.IO.File]::ReadAllText("$PSScriptRoot/../js/data.js", [System.Text.Encoding]::UTF8)
$trimmed = $raw.Trim()
if ($trimmed.StartsWith("var UDON_COMPANIES =")) {
    $json = $trimmed.Substring(21).Trim()
    if ($json.EndsWith(";")) {
        $json = $json.Substring(0, $json.Length - 1).Trim()
    }
}
$ser = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$ser.MaxJsonLength = [Int32]::MaxValue
try {
    $arr = $ser.DeserializeObject($json)
    Write-Output "Successfully deserialized! Total items: $($arr.Length)"
    foreach ($item in $arr) {
        if ($item["id"] -eq "comp-udon-06") {
            Write-Output "Found comp-udon-06: $($item['name'])"
            $jsonComp = $ser.Serialize($item)
            [System.IO.File]::WriteAllText("$PSScriptRoot/comp06_found.json", $jsonComp, [System.Text.Encoding]::UTF8)
            Write-Output "Saved to scratch/comp06_found.json"
            break
        }
    }
} catch {
    Write-Output "Error: $_"
}
