$content = [IO.File]::ReadAllText('js/data.js', [System.Text.Encoding]::UTF8)
$start = $content.IndexOf('[')
$end = $content.LastIndexOf(']')
$jsonText = $content.Substring($start, $end - $start + 1)
$list = $jsonText | ConvertFrom-Json

$results = @()
$i = 1
foreach ($item in $list) {
    $results += [PSCustomObject]@{
        No = $i
        Name = $item.name
        District = $item.district
        Address = $item.address
        MapsUrl = $item.googleMapsUrl
    }
    $i++
}

$results | Export-Csv -Path 'scratch/company_locations_summary.csv' -NoTypeInformation -Encoding UTF8
