$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
$item = $dataList | Where-Object { $_.name -like "*พีเอ*" -or $_.engName -like "*PA*" -or $_.id -eq "comp-udon-32" }
$item | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 "scratch/item_32.json"

$dataset = Get-Content -Encoding UTF8 -Path "scratch/dataset.json" | ConvertFrom-Json
$posts = $dataset | Where-Object { 
    ($_.pageName -like "*พีเอ*" -or $_.pageName -like "*PA*" -or $_.url -like "*PA*" -or $_.facebookUrl -like "*PA*" -or $_.inputUrl -like "*PA*" -or $_.text -like "*พีเอ*")
}
Write-Output ("Found posts in dataset: " + $posts.Count)
$posts | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 "scratch/pa_posts.json"
