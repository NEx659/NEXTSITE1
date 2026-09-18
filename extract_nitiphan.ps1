$content = Get-Content -Encoding UTF8 scratch/dataset.json -Raw
# Let's extract items where inputUrl or facebookUrl or id contains 61555396955045
$json = $content | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.facebookUrl -like "*61555396955045*") -or 
    ($_.inputUrl -like "*61555396955045*") -or 
    ($_.url -like "*61555396955045*") -or
    ($_.pageName -like "*นิติพันธ์*") -or
    ($_.caption -like "*นิติพันธ์*")
}
$posts | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 scratch/nitiphan_posts.json
Write-Output "Found $($posts.Count) posts"
