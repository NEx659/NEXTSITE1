$content = Get-Content 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$data = $jsonStr | ConvertFrom-Json

Write-Output "All 58 Companies in data.js:"
$idx = 1
foreach ($c in $data) {
    Write-Output ("[$idx] " + $c.id + " | " + $c.name + " | FB: " + $c.facebookUrl)
    $idx++
}
