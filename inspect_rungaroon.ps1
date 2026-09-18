[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.facebookUrl -and $_.facebookUrl.Contains('100034948943142')) -or
    ($_.url -and $_.url.Contains('100034948943142')) -or
    ($_.inputUrl -and $_.inputUrl.Contains('100034948943142'))
}

Write-Output ("Total posts found for Cho Rungarun: " + $posts.Count)
$idx = 1
foreach ($p in $posts) {
    Write-Output ("===============================")
    Write-Output ("Post " + $idx + " | Time: " + $p.time + " | URL: " + $p.url)
    Write-Output ($p.text)
    $idx++
}
