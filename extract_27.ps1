$content = Get-Content -Encoding UTF8 scratch/dataset.json -Raw
$json = $content | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.facebookUrl -like "*banwisawa*") -or 
    ($_.inputUrl -like "*banwisawa*") -or 
    ($_.url -like "*banwisawa*") -or
    ($_.caption -like "*080-748-8844*") -or
    ($_.caption -like "*0807488844*") -or
    ($_.pageName -like "*banwisawa*")
}
$posts | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 scratch/banwisawa_posts.json
Write-Output "Found $($posts.Count) posts for Baan Witsawa"
