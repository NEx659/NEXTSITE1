[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.pageName -and ($_.pageName -like "*น่าอยู่*" -or $_.pageName -like "*Nayoo*")) -or
    ($_.user -and $_.user.name -and ($_.user.name -like "*น่าอยู่*" -or $_.user.name -like "*Nayoo*"))
}

Write-Output ("Total posts found for Nayoo House: " + $posts.Count)
$idx = 1
foreach ($p in $posts) {
    Write-Output ("===============================")
    Write-Output ("Post " + $idx + " | Time: " + $p.time + " | URL: " + $p.url)
    Write-Output ($p.text)
    $idx++
}
