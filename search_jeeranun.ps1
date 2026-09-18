[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json

$pages = $json | ForEach-Object { 
    if ($_.pageName) { $_.pageName } 
    elseif ($_.user -and $_.user.name) { $_.user.name }
    elseif ($_.facebookUrl) { $_.facebookUrl }
} | Select-Object -Unique

Write-Object "Unique pages in dataset.json:"
$pages | ForEach-Object { Write-Output " - $_" }

$content = Get-Content 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$data = $jsonStr | ConvertFrom-Json

Write-Output "`nSearching all 58 companies in data.js for 'จีรนันท์' or 'Jeeranun'..."
$found = $false
foreach ($c in $data) {
    if ($c.name -like '*จีรนันท์*' -or $c.engName -like '*Jeeranun*' -or $c.facebookUrl -like '*jeeranun*' -or $c.contactPerson -like '*จีรนันท์*') {
        Write-Output ("Found: " + $c.id + " | " + $c.name + " | FB: " + $c.facebookUrl + " | Address: " + $c.address + " | Phone: " + $c.phone)
        $found = $true
    }
}
if (-not $found) {
    Write-Output "No direct match. Listing company names with 'พร็อพเพอร์ตี้' or similar:"
    foreach ($c in $data) {
        if ($c.name -like '*พร็อพเพอร์ตี้*' -or $c.name -like '*Property*' -or $c.category -like '*พร็อพเพอร์ตี้*') {
            Write-Output (" - " + $c.id + ": " + $c.name)
        }
    }
}
