[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.pageName -and ($_.pageName -like "*ทเวนตี้ซิกซ์*" -or $_.pageName -like "*Twentysix*")) -or
    ($_.user -and $_.user.name -and ($_.user.name -like "*ทเวนตี้ซิกซ์*" -or $_.user.name -like "*Twentysix*"))
}

for ($i = 0; $i -lt 5; $i++) {
    Write-Output ("=== Post " + ($i+1) + " | Time: " + $posts[$i].time + " ===")
    Write-Output ($posts[$i].text)
}
