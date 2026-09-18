$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json
$posts = @()
$seenUrls = @{}
foreach ($item in $data) {
    $itemUrl = if ($item.postUrl) { $item.postUrl } else { $item.url }
    $pageName = $item.pageName
    $name = $item.user.name
    $fbUrl = $item.facebookUrl
    $inputUrl = $item.inputUrl
    $text = $item.text
    $s = "$fbUrl $itemUrl $pageName $name $inputUrl $text".ToLower()
    if ($s -match 'wonder' -or $s -match 'วันเดอร์' -or $s -match 'comp-udon-45') {
        if (-not $seenUrls.ContainsKey($itemUrl) -and $itemUrl) {
            $seenUrls[$itemUrl] = $true
            $posts += [PSCustomObject]@{
                url = $itemUrl
                date = $item.time
                pageName = $pageName
                fbUrl = $fbUrl
                text = $text
                ocrText = if ($item.images) { ($item.images | ForEach-Object { $_.ocrText }) -join ' | ' } else { '' }
            }
        }
    }
}
Write-Output ('Total Wonder Creation unique posts found: ' + $posts.Count)
$posts | ConvertTo-Json -Depth 5 | Out-File -FilePath 'scratch/wonder_posts.json' -Encoding UTF8

$out = @()
$out += "TOTAL WONDER CREATION POSTS: $($posts.Count)"
$i = 1
foreach ($p in $posts) {
    $out += "-------------------- POST $i --------------------"
    $out += "URL: $($p.url)"
    $out += "DATE: $($p.date)"
    $out += "PAGE: $($p.pageName)"
    $out += "FB_URL: $($p.fbUrl)"
    $out += "TEXT: $($p.text)"
    if ($p.ocrText) {
        $out += "OCR: $($p.ocrText)"
    }
    $out += ""
    $i++
}
Set-Content -Path 'scratch/wonder_posts_clean.txt' -Value $out -Encoding UTF8
Write-Output "Saved to scratch/wonder_posts_clean.txt"
