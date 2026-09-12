$content = Get-Content -LiteralPath 'index.html' -Raw -Encoding UTF8
$matches = [regex]::Matches($content, '(?m)^\s*\"id\":\s*\"([^\"]+)\"')
Write-Host "Total Companies in index.html: $($matches.Count)"
