$content = Get-Content -Encoding UTF8 scratch/dataset.json -Raw
$json = $content | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.facebookUrl -like "*esarnthaihouse*") -or 
    ($_.inputUrl -like "*esarnthaihouse*") -or 
    ($_.url -like "*esarnthaihouse*") -or
    ($_.pageName -like "*อีเฮาส์*") -or
    ($_.pageName -like "*อีสานไทยเฮาส์*") -or
    ($_.pageName -like "*E House*") -or
    ($_.caption -like "*อีเฮาส์*") -or
    ($_.caption -like "*อีสานไทยเฮาส์*")
}
$posts | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 scratch/ehouse_posts.json
Write-Output "Found $($posts.Count) posts for E-House"
