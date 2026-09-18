$content = Get-Content -Encoding UTF8 js/data.js
$content | Where-Object { $_ -match '"id":\s*"comp-udon' } | ForEach-Object { $_.Trim() }
