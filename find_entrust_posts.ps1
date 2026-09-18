$dataset = Get-Content -Encoding UTF8 -Path "scratch/dataset.json" | ConvertFrom-Json
$entrustPosts = $dataset | Where-Object { 
    ($_.facebookUrl -like "*ENTRUST*" -or $_.inputUrl -like "*ENTRUST*" -or $_.url -like "*ENTRUST*" -or $_.pageName -like "*เอ็นทรัสท*" -or $_.text -like "*Trust construction*")
}
Write-Output ("Found Entrust posts in dataset: " + $entrustPosts.Count)
for ($i = 0; $i -lt $entrustPosts.Count; $i++) {
    $p = $entrustPosts[$i]
    Write-Output ("--- Post " + ($i + 1) + " ---")
    Write-Output ("URL: " + $p.url)
    Write-Output ("PostUrl: " + $p.postUrl)
    Write-Output ("InputUrl: " + $p.inputUrl)
    Write-Output ("TopLevelUrl: " + $p.topLevelUrl)
    Write-Output ("Time: " + $p.time)
    Write-Output ("Text snippet: " + ($p.text.Substring(0, [Math]::Min(120, $p.text.Length)) -replace "`n", " "))
}
