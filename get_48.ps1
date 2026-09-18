$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$dataList = $jsonStr | ConvertFrom-Json
$item = $dataList | Where-Object { $_.id -eq "comp-udon-48" }
$item | ConvertTo-Json -Depth 6 | Out-File -Encoding utf8 "scratch/comp48_current.json"

Write-Output ("Company Name: " + $item.name)
Write-Output ("Facebook URL: " + $item.facebookUrl)
Write-Output ("SCG Code: " + $item.scgCode)
Write-Output ("Sales 2025: " + $item.sales2025)
Write-Output ("Sales 2026: " + $item.sales2026)

$fbUrl = $item.facebookUrl
$dataset = Get-Content -Encoding UTF8 -Path "scratch/dataset.json" | ConvertFrom-Json
$posts = $dataset | Where-Object { 
    $_.facebookUrl -eq $fbUrl -or $_.inputUrl -eq $fbUrl -or $_.url -like "*$($item.id)*" -or $_.pageName -like "*Bandee*"
}
Write-Output ("Matching posts in dataset: " + $posts.Count)
$posts | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 "scratch/bandee_posts.json"
