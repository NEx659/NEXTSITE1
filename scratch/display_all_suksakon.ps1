[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.pageName -and ($_.pageName -like "*สุขสกล*" -or $_.pageName -like "*Nasit*" -or $_.pageName -like "*NASIT*" -or $_.pageName -like "*suksakon*")) -or
    ($_.user -and $_.user.name -and ($_.user.name -like "*สุขสกล*" -or $_.user.name -like "*Nasit*" -or $_.user.name -like "*NASIT*" -or $_.user.name -like "*suksakon*"))
}

$idx = 1
foreach ($p in $posts) {
    Write-Output ("===============================")
    Write-Output ("Post " + $idx + " | Time: " + $p.time + " | URL: " + $p.url)
    Write-Output ($p.text)
    $idx++
}
