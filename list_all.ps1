$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
# Find all occurrences of id and name
$matches = [regex]::Matches($content, '"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)"')
foreach ($m in $matches) {
    Write-Output ($m.Groups[1].Value + " | " + $m.Groups[2].Value)
}
