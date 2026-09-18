$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
$item = $dataList | Where-Object { $_.name -like "*กิจดลวรโชติ*" -or $_.id -eq "comp-udon-22" }
$item | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 "scratch/comp22_current.json"

$dataset = Get-Content -Encoding UTF8 -Path "scratch/dataset.json" | ConvertFrom-Json
$posts = $dataset | Where-Object { 
    ($_.pageName -like "*กิจดล*" -or $_.pageName -like "*วรโชติ*" -or $_.url -like "*กิจดล*" -or $_.facebookUrl -like "*กิจดล*" -or $_.inputUrl -like "*กิจดล*" -or $_.text -like "*กิจดล*" -or $_.text -like "*วรโชติ*")
}
Write-Output ("Found posts in dataset: " + $posts.Count)
$posts | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 "scratch/kitdon_posts.json"
