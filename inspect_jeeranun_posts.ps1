[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.pageName -and ($_.pageName -like "*Joyly*" -or $_.pageName -like "*ซีที*" -or $_.pageName -like "*จีรนันท์*")) -or
    ($_.user -and $_.user.name -and ($_.user.name -like "*Joyly*" -or $_.user.name -like "*ซีที*" -or $_.user.name -like "*จีรนันท์*")) -or
    ($_.facebookUrl -and $_.facebookUrl -like "*Joyly*") -or
    ($_.url -and $_.url -like "*Joyly*") -or
    ($_.inputUrl -and $_.inputUrl -like "*Joyly*")
}

Write-Output ("Total posts found for Jeeranun Property (JoylyYothakaree / ซีที การก่อสร้าง): " + $posts.Count)
$idx = 1
foreach ($p in $posts) {
    Write-Output ("===============================")
    Write-Output ("Post " + $idx + " | Time: " + $p.time + " | URL: " + $p.url)
    Write-Output ($p.text)
    $idx++
}
