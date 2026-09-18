$raw = [System.IO.File]::ReadAllText("$PSScriptRoot/../js/data.js", [System.Text.Encoding]::UTF8)

# Check first and last 200 chars
Write-Output "First 100 chars: $($raw.Substring(0, [Math]::Min(100, $raw.Length)))"
Write-Output "Last 100 chars: $($raw.Substring([Math]::Max(0, $raw.Length - 100)))"

$trimmed = $raw.Trim()
if ($trimmed.StartsWith("var UDON_COMPANIES =")) {
    $json = $trimmed.Substring(21).Trim()
    if ($json.EndsWith(";")) {
        $json = $json.Substring(0, $json.Length - 1).Trim()
    }
    try {
        $arr = $json | ConvertFrom-Json
        Write-Output "SUCCESS! Total companies: $($arr.Count)"
        $c06 = $arr | Where-Object { $_.id -eq 'comp-udon-06' }
        if ($c06) {
            Write-Output "Found comp-udon-06: $($c06.name)"
            $c06 | ConvertTo-Json -Depth 6 | Out-File -Encoding UTF8 "$PSScriptRoot/comp06_found.json"
        } else {
            Write-Output "comp-udon-06 not found by id in array!"
        }
    } catch {
        Write-Output "JSON parse error: $_"
    }
}
