[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.pageName -and ($_.pageName -like "*น่าอยู่*" -or $_.pageName -like "*Nayoo*")) -or
    ($_.user -and $_.user.name -and ($_.user.name -like "*น่าอยู่*" -or $_.user.name -like "*Nayoo*"))
}

for ($i = 0; $i -lt 5; $i++) {
    Write-Output ("===============================")
    Write-Output ("Post " + ($i+1) + " | Time: " + $posts[$i].time + " | URL: " + $posts[$i].url)
    Write-Output ($posts[$i].text)
}
