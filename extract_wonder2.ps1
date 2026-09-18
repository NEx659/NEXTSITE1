$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

$posts = @()
$seen = @{}

foreach ($item in $data) {
    $u = if ($item.postUrl) { $item.postUrl } else { $item.url }
    $fb = $item.facebookUrl
    $input = $item.inputUrl
    $name = $item.pageName
    $text = $item.text

    if ($fb -match 'WonderCreation' -or $input -match 'WonderCreation' -or $u -match 'WonderCreation' -or $name -match 'Wonder' -or $name -match 'วันเดอร์') {
        if ($u -and -not $seen[$u]) {
            $seen[$u] = $true
            $posts += $item
        }
    }
}

Write-Output "Total Wonder Creation posts: $($posts.Count)"
$posts | ConvertTo-Json -Depth 5 | Set-Content 'scratch/wonder_posts.json' -Encoding UTF8

$out = @()
$out += "TOTAL WONDER CREATION POSTS: $($posts.Count)"
$i = 1
foreach ($p in $posts) {
    $out += "-------------------- POST $i --------------------"
    $out += "URL: $($p.url)"
    $out += "POST_URL: $($p.postUrl)"
    $out += "TIME: $($p.time) | $($p.date)"
    $out += "PAGE_NAME: $($p.pageName)"
    $out += "TEXT: $($p.text)"
    if ($p.images) {
        $ocrs = ($p.images | ForEach-Object { $_.ocrText }) -join " | "
        $out += "OCR: $ocrs"
    }
    $out += ""
    $i++
}
Set-Content -Path 'scratch/wonder_posts_clean.txt' -Value $out -Encoding UTF8
Write-Output "Saved clean output to scratch/wonder_posts_clean.txt"
