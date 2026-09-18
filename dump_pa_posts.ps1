$dataset = Get-Content -Encoding UTF8 -Path "scratch/dataset.json" | ConvertFrom-Json
$paPosts = $dataset | Where-Object { 
    ($_.facebookUrl -like "*PATN*" -or $_.inputUrl -like "*PATN*" -or $_.url -like "*PATN*" -or $_.pageName -like "*PA&TN*" -or $_.pageName -like "*พีเอ*" -or $_.text -like "*PA&TN*" -or $_.text -like "*Peesapat*")
}
Write-Output ("Found PA & TN posts: " + $paPosts.Count)
for ($i = 0; $i -lt $paPosts.Count; $i++) {
    $p = $paPosts[$i]
    Write-Output ("================== POST " + ($i+1) + " ==================")
    Write-Output ("Time: " + $p.time)
    Write-Output ("URL: " + $p.url)
    Write-Output ("TopLevelUrl: " + $p.topLevelUrl)
    Write-Output ("Text: " + $p.text)
}
