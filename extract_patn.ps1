$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8 | ConvertFrom-Json

$patn = @()
$seen = @{}

foreach ($item in $raw) {
    $u = if ($item.postUrl) { $item.postUrl } else { $item.url }
    $fb = $item.facebookUrl
    $input = $item.inputUrl
    $name = $item.pageName
    $text = $item.text
    $s = "$fb $input $u $name $text"

    if ($s -match 'PATN2021' -or $s -match 'PATN' -or $s -match 'พีเอ แอนด์ ทีเอ็น' -or $s -match 'พีเอ') {
        if ($u -and -not $seen[$u]) {
            $seen[$u] = $true
            $patn += $item
        }
    }
}

Write-Output "Total PATN posts found: $($patn.Count)"
$patn | ConvertTo-Json -Depth 5 | Set-Content 'scratch/patn_posts.json' -Encoding UTF8

$out = @()
$out += "TOTAL PATN POSTS: $($patn.Count)"
$i = 1
foreach ($p in $patn) {
    $out += "-------------------- POST $i --------------------"
    $out += "URL: $(if ($p.postUrl) { $p.postUrl } else { $p.url })"
    $out += "FB_URL: $($p.facebookUrl)"
    $out += "PAGE_NAME: $($p.pageName)"
    $out += "TIME: $($p.time) | $($p.date)"
    $out += "TEXT: $($p.text)"
    if ($p.images) {
        $ocrs = ($p.images | ForEach-Object { $_.ocrText }) -join " | "
        $out += "OCR: $ocrs"
    }
    $out += ""
    $i++
}
Set-Content -Path 'scratch/patn_clean.txt' -Value $out -Encoding UTF8
Write-Output "Saved to scratch/patn_clean.txt"
