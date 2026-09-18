[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.pageName -and ($_.pageName -like "*จีรนันท์*" -or $_.pageName -like "*Jeeranun*" -or $_.pageName -like "*jeeranun*")) -or
    ($_.user -and $_.user.name -and ($_.user.name -like "*จีรนันท์*" -or $_.user.name -like "*Jeeranun*" -or $_.user.name -like "*jeeranun*"))
}

Write-Output ("Total posts found for Jeeranun Property: " + $posts.Count)
$idx = 1
foreach ($p in $posts) {
    Write-Output ("===============================")
    Write-Output ("Post " + $idx + " | Time: " + $p.time + " | URL: " + $p.url)
    Write-Output ($p.text)
    $idx++
}

$content = Get-Content 'c:\Users\pannipan\Downloads\N\js\data.js' -Raw -Encoding UTF8
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$data = $jsonStr | ConvertFrom-Json

$comp = $data | Where-Object { $_.name -like '*จีรนันท์*' -or $_.engName -like '*Jeeranun*' }
if ($comp) {
    Write-Output ("Found Company in data.js: " + $comp.id + " | " + $comp.name + " | Phone: " + $comp.phone + " | Address: " + $comp.address + " | Total Projects: " + $comp.totalProjects)
}
