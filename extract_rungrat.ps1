$content = Get-Content -Encoding UTF8 scratch/dataset.json -Raw
$json = $content | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.facebookUrl -like "*100084354175964*") -or 
    ($_.inputUrl -like "*100084354175964*") -or 
    ($_.url -like "*100084354175964*") -or
    ($_.caption -like "*098-134-5273*") -or
    ($_.caption -like "*098-435-0263*") -or
    ($_.pageName -like "*Rungrat*") -or
    ($_.caption -like "*Rungrat*")
}
$posts | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 scratch/rungrat_posts.json
Write-Output "Found $($posts.Count) posts for Rungrat"
