[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$raw = Get-Content 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.pageName -and ($_.pageName -like "*น่าอยู่*" -or $_.pageName -like "*Nayoo*")) -or
    ($_.user -and $_.user.name -and ($_.user.name -like "*น่าอยู่*" -or $_.user.name -like "*Nayoo*"))
}
$out = @()
$idx = 1
foreach ($p in $posts) {
    $out += ("================================================================================")
    $out += ("POST #" + $idx + " | Time: " + $p.time + " | URL: " + $p.url)
    $out += ("Page/User: " + $p.pageName + " / " + $p.user.name)
    $out += ("Text:")
    $out += $p.text
    $idx++
}
$out | Set-Content -Path 'c:\Users\pannipan\Downloads\N\scratch\nayoo_posts_clean.txt' -Encoding UTF8
Write-Output ("Wrote " + $posts.Count + " posts to scratch/nayoo_posts_clean.txt")
