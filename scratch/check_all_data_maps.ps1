$content = Get-Content 'js/data.js' -Raw -Encoding UTF8

# Parse using JS in HTML or Regex
$pattern = '(?ms)\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",(?:.*?)"googleMapsUrl":\s*"([^"]+)"'
$matches = [regex]::Matches($content, $pattern)

Write-Host "Found $($matches.Count) companies in data.js"
$i = 1
foreach ($m in $matches) {
    $id = $m.Groups[1].Value
    $name = $m.Groups[2].Value
    $map = $m.Groups[3].Value
    Write-Host "$i. [$id] $name -> $map"
    $i++
}
