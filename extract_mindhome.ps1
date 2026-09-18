$content = Get-Content -Encoding UTF8 scratch/dataset.json -Raw
$json = $content | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.facebookUrl -like "*MindHome*") -or 
    ($_.inputUrl -like "*MindHome*") -or 
    ($_.url -like "*MindHome*") -or
    ($_.pageName -like "*MindHome*") -or
    ($_.pageName -like "*Mind Home*") -or
    ($_.caption -like "*MindHome*") -or
    ($_.caption -like "*Mind Home*") -or
    ($_.caption -like "*063*723*9988*") -or
    ($_.caption -like "*0637239988*")
}
$posts | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 scratch/mindhome_posts.json
Write-Output "Found $($posts.Count) posts for Mind Home"
