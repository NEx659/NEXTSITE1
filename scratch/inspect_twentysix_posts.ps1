[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.pageName -and ($_.pageName -like "*ทเวนตี้ซิกซ์*" -or $_.pageName -like "*Twentysix*")) -or
    ($_.user -and $_.user.name -and ($_.user.name -like "*ทเวนตี้ซิกซ์*" -or $_.user.name -like "*Twentysix*"))
}

Write-Output ("Found " + $posts.Count + " posts for Twentysix:")
$idx = 1
foreach ($p in $posts) {
    Write-Output ("===============================")
    Write-Output ("Post " + $idx + " | Time: " + $p.time + " | URL: " + $p.url)
    Write-Output ($p.text)
    $idx++
}
