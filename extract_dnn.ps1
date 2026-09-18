$content = Get-Content -Encoding UTF8 scratch/dataset.json -Raw
$json = $content | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.facebookUrl -like "*61576710850214*") -or 
    ($_.inputUrl -like "*61576710850214*") -or 
    ($_.url -like "*61576710850214*") -or
    ($_.pageName -like "*DNN*") -or
    ($_.caption -like "*DNN*")
}
$posts | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 scratch/dnn_posts.json
Write-Output "Found $($posts.Count) posts for DNN"
