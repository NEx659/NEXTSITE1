$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

Write-Output "Dataset total items: $($data.Count)"

$wonderPosts = @()
$seen = @{}

foreach ($item in $data) {
    $itemStr = ($item | ConvertTo-Json -Compress)
    if ($itemStr -match 'วันเดอร์' -or $itemStr -match 'wonder' -or $itemStr -match 'Wonder' -or $itemStr -match '45') {
        $u = if ($item.postUrl) { $item.postUrl } elseif ($item.url) { $item.url } else { $item.text.Substring(0, [Math]::Min(30, $item.text.Length)) }
        if ($u -and -not $seen[$u]) {
            $seen[$u] = $true
            $wonderPosts += $item
        }
    }
}

Write-Output "Found wonder posts: $($wonderPosts.Count)"
$wonderPosts | ConvertTo-Json -Depth 4 | Set-Content 'scratch/wonder_posts.json' -Encoding UTF8

$out = @()
$i = 1
foreach ($p in $wonderPosts) {
    $out += "==================== POST $i ===================="
    $out += "URL: $($p.url)"
    $out += "POST_URL: $($p.postUrl)"
    $out += "PAGE_NAME: $($p.pageName)"
    $out += "FB_URL: $($p.facebookUrl)"
    $out += "DATE: $($p.time) | $($p.date)"
    $out += "TEXT: $($p.text)"
    if ($p.images) {
        $ocrs = ($p.images | ForEach-Object { $_.ocrText }) -join " "
        $out += "OCR: $ocrs"
    }
    $out += ""
    $i++
}
Set-Content -Path 'scratch/wonder_posts_clean.txt' -Value $out -Encoding UTF8
Write-Output "Saved to scratch/wonder_posts_clean.txt"
