$content = Get-Content 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$data = $jsonStr | ConvertFrom-Json

$comp = $data | Where-Object { $_.name -like '*สุขสกล*' -or $_.name -like '*Nasit*' -or $_.engName -like '*Nasit*' -or $_.engName -like '*Suksakon*' }
if ($comp) {
    Write-Output ("Found Company: " + $comp.id + " | " + $comp.name + " | Phone: " + $comp.phone + " | Total Projects: " + $comp.totalProjects)
} else {
    Write-Output "Searching all companies by index..."
    for ($i=0; $i -lt $data.Count; $i++) {
        if ($data[$i].facebookUrl -like '*nasit*' -or $data[$i].address -like '*สุขสกล*' -or $data[$i].id -eq 'comp-udon-05') {
            Write-Output ("Index " + $i + ": " + $data[$i].id + " | " + $data[$i].name)
        }
    }
}
