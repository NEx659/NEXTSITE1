$raw = Get-Content 'scratch/pa_posts.json' -Raw -Encoding UTF8 | ConvertFrom-Json

$seen = @{}
$unique = @()
foreach ($item in $raw) {
    $u = if ($item.postUrl) { $item.postUrl } elseif ($item.url) { $item.url } else { $item.text.Substring(0, [Math]::Min(30, $item.text.Length)) }
    if ($u -and -not $seen[$u]) {
        $seen[$u] = $true
        $unique += $item
    }
}

Write-Output "Total unique posts: $($unique.Count)"

$out = @()
$out += "TOTAL PA & TN POSTS: $($unique.Count)"
$i = 1
foreach ($p in ($unique | Select-Object -First 10)) {
    $out += "-------------------- POST $i --------------------"
    $out += "URL: $(if ($p.postUrl) { $p.postUrl } else { $p.url })"
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

Set-Content -Path 'scratch/pa_10posts_clean.txt' -Value $out -Encoding UTF8
Write-Output "Written 10 posts to scratch/pa_10posts_clean.txt"
