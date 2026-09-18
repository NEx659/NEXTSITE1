$dataset = Get-Content -Encoding UTF8 -Path "scratch/dataset.json" | ConvertFrom-Json
$entrustPosts = $dataset | Where-Object { 
    ($_.facebookUrl -like "*ENTRUST*" -or $_.inputUrl -like "*ENTRUST*" -or $_.url -like "*ENTRUST*" -or $_.pageName -like "*เอ็นทรัสท*" -or $_.text -like "*Trust construction*")
}
for ($i = 0; $i -lt $entrustPosts.Count; $i++) {
    $p = $entrustPosts[$i]
    Write-Output ("================== POST " + ($i+1) + " ==================")
    Write-Output ("Date: " + $p.time)
    Write-Output ("URL: " + $p.url)
    Write-Output ("TopLevelUrl: " + $p.topLevelUrl)
    Write-Output ("Text: " + $p.text)
}
