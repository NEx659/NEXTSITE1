$content = Get-Content -Encoding UTF8 scratch/dataset.json -Raw
$json = $content | ConvertFrom-Json
$posts = $json | Where-Object { 
    ($_.facebookUrl -like "*PhongsakRuangsiwakun*") -or 
    ($_.inputUrl -like "*PhongsakRuangsiwakun*") -or 
    ($_.url -like "*PhongsakRuangsiwakun*") -or
    ($_.facebookUrl -like "*359779854451767*") -or 
    ($_.inputUrl -like "*359779854451767*") -or 
    ($_.url -like "*359779854451767*") -or
    ($_.caption -like "*117architect*") -or
    ($_.caption -like "*089*615*9559*") -or
    ($_.caption -like "*0896159559*")
}
$posts | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 scratch/arch117_posts.json
Write-Output "Found $($posts.Count) posts for 117 Architect"
