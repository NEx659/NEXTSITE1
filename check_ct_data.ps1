$c = [System.IO.File]::ReadAllText("$PSScriptRoot/ct_data.json", [System.Text.Encoding]::UTF8)
Write-Output "ct_data.json length: $($c.Length)"

try {
    $arr = $c | ConvertFrom-Json
    Write-Output "Parsed ct_data.json count: $($arr.Count)"
    $ids = $arr | ForEach-Object { $_.id }
    Write-Output "First 5 ids: $($ids[0..4] -join ', ')"
    Write-Output "Last 5 ids: $($ids[($ids.Count-5)..($ids.Count-1)] -join ', ')"
} catch {
    Write-Output "Error: $_"
}
