$content = Get-Content 'js/data.js' -Raw -Encoding UTF8
$pattern = '(?ms)\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",(?:.*?)"googleMapsUrl":\s*"([^"]+)"'
$matches = [regex]::Matches($content, $pattern)

for ($i = 0; $i -lt 30; $i++) {
    $m = $matches[$i]
    $id = $m.Groups[1].Value
    $name = $m.Groups[2].Value
    $map = $m.Groups[3].Value
    Write-Host "$($i+1). [$id] $name -> $map"
}
