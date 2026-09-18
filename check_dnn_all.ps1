$content = Get-Content -Encoding UTF8 scratch/dataset.json -Raw
$json = $content | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.facebookUrl -like "*61576710850214*") -or 
    ($_.inputUrl -like "*61576710850214*") -or 
    ($_.url -like "*61576710850214*") -or
    ($_.pageName -like "*DNN*") -or
    ($_.caption -like "*DNN*") -or
    ($_.caption -like "*063*046*5748*") -or
    ($_.caption -like "*0630465748*")
}
$posts | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 scratch/dnn_posts.json
Write-Output "Found $($posts.Count) posts"
