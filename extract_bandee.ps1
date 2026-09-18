$jsonPath = 'c:\Users\pannipan\Downloads\N\scratch\dataset.json'
$json = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$posts = ConvertFrom-Json $json

$bandeePosts = $posts | Where-Object { 
    $_.page_name -like '*Bandee*' -or 
    $_.page_name -like '*บ้านดี อยู่ดี*' -or 
    $_.post_text -like '*081-556-9261*' -or 
    $_.post_text -like '*0815569261*' -or
    $_.post_text -like '*nut9722*' -or
    $_.post_text -like '*บ้านดี อยู่ดี ดีไซน์*'
}

Write-Host "Total posts found: $($bandeePosts.Count)"

$i = 1
foreach ($p in $bandeePosts) {
    Write-Host "========================================="
    Write-Host "Post #$i | ID: $($p.post_id) | Date: $($p.post_date)"
    Write-Host "URL: $($p.post_url)"
    Write-Host "Page: $($p.page_name)"
    Write-Host "Text:"
    Write-Host $p.post_text
    Write-Host "Image Count: $($p.images.Count)"
    $i++
}
