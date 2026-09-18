[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.pageName -and ($_.pageName -like "*สุขสกล*" -or $_.pageName -like "*Nasit*" -or $_.pageName -like "*NASIT*" -or $_.pageName -like "*suksakon*")) -or
    ($_.user -and $_.user.name -and ($_.user.name -like "*สุขสกล*" -or $_.user.name -like "*Nasit*" -or $_.user.name -like "*NASIT*" -or $_.user.name -like "*suksakon*"))
}

for ($i = 0; $i -lt 4; $i++) {
    Write-Output ("===============================")
    Write-Output ("Post " + ($i+1) + " | Time: " + $posts[$i].time + " | URL: " + $posts[$i].url)
    Write-Output ($posts[$i].text)
}
