# Read dataset.json or data.js
$txt = [System.IO.File]::ReadAllText("$PSScriptRoot/../js/data.js", [System.Text.Encoding]::UTF8)

# Find where comp-udon-06 is
$idx = $txt.IndexOf('"id": "comp-udon-06"')
if ($idx -lt 0) {
    $idx = $txt.IndexOf('"id":  "comp-udon-06"')
}
Write-Output "Index in data.js: $idx"

if ($idx -ge 0) {
    $start = $txt.LastIndexOf('{', $idx)
    # let's find the matching closing brace or a chunk of 4000 chars
    $chunk = $txt.Substring($start, [Math]::Min(8000, $txt.Length - $start))
    Write-Output "--- COMP 06 CHUNK IN DATA.JS ---"
    Write-Output $chunk.Substring(0, [Math]::Min(3000, $chunk.Length))
}
