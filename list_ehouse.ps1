$raw = Get-Content 'scratch/esarnthaihouse_posts.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$ehouse = $raw | Where-Object { $_.pageName -eq 'esarnthaihouse' }
$idx = 1
foreach ($p in $ehouse) {
    Write-Output "=========================================="
    Write-Output "Post #$idx | Date: $($p.time)"
    Write-Output "URL: $($p.url)"
    Write-Output "Content:"
    Write-Output $p.text
    Write-Output ""
    $idx++
}
