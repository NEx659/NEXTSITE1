[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$udPosts = Get-Content "scratch/udhome_posts.json" -Raw -Encoding UTF8 | ConvertFrom-Json
Write-Output "Total posts in udhome_posts.json: $($udPosts.Count)"

$i = 1
foreach ($p in $udPosts) {
    Write-Output "=================================================="
    Write-Output "POST #$i"
    Write-Output "Date: $($p.time)"
    Write-Output "URL: $($p.url)"
    Write-Output "Text: $($p.text)"
    Write-Output ""
    $i++
}
