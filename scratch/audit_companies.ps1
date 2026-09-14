$content = [IO.File]::ReadAllText('js/data.js', [Text.Encoding]::UTF8)
$start = $content.IndexOf('[')
$end = $content.LastIndexOf(']')
$jsonText = $content.Substring($start, $end - $start + 1)
$list = $jsonText | ConvertFrom-Json

Write-Host "=== AUDIT OF ALL 54 COMPANIES IN UDON DATA ==="
$i = 1
foreach ($item in $list) {
    Write-Host "$i. [$($item.district)] $($item.name)"
    Write-Host "   Address: $($item.address)"
    Write-Host "   Maps: $($item.googleMapsUrl)"
    Write-Host "--------------------------------------------------"
    $i++
}
