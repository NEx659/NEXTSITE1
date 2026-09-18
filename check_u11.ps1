$c = [System.IO.File]::ReadAllText("$PSScriptRoot/../js/data.js", [System.Text.Encoding]::UTF8)
$clean = $c -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$arr = $clean | ConvertFrom-Json
$u = $arr | Where-Object { $_.id -eq 'comp-udon-11' }
$u | ConvertTo-Json -Depth 6
