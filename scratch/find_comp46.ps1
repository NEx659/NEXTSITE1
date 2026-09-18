$data = Get-Content -Raw -Encoding UTF8 'c:\Users\pannipan\Downloads\N\js\data.js'
$match = [regex]::Match($data, '"id":\s*"comp-udon-46"[\s\S]*?(?=\n\s*\{\s*"id"|\Z)')
if ($match.Success) {
    Write-Output "FOUND comp-udon-46!"
    Write-Output $match.Value.Substring(0, [Math]::Min(1200, $match.Value.Length))
} else {
    Write-Output "NOT FOUND"
}
