$content = Get-Content -LiteralPath 'js\data.js' -Raw -Encoding UTF8
$matches = [regex]::Matches($content, '(?m)^\s*\{\s*\"id\":\s*\"([^\"]+)\"')
Write-Host "Total Companies in js/data.js: $($matches.Count)"
