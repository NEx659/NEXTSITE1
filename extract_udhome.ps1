$files = @(
    'scratch/dataset.json',
    'scratch/raw_data_udon_1.json',
    'scratch/raw_data_udon_2.json',
    'scratch/raw_data_udon_3.json',
    'scratch/raw_data_udon_4.json',
    'scratch/raw_data_udon_5.json'
)

$allPosts = @()

foreach ($f in $files) {
    if (Test-Path $f) {
        $json = Get-Content $f -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($json -is [array]) {
            foreach ($item in $json) {
                if ($item.pageName -like '*UD.Home*' -or $item.facebookUrl -like '*UD.Home*' -or $item.url -like '*UD.Home*') {
                    $allPosts += $item
                }
            }
        }
    }
}

$unique = @{}
$deduped = @()

foreach ($p in $allPosts) {
    $url = $p.url
    if (-not $url) { $url = $p.postUrl }
    if ($url -and -not $unique.ContainsKey($url)) {
        $unique[$url] = $true
        $deduped += $p
    }
}

# Sort by time descending
$sorted = $deduped | Sort-Object -Property time -Descending

Set-Content -Path 'scratch/udhome_posts.json' -Value ($sorted | ConvertTo-Json -Depth 5) -Encoding UTF8
Write-Output "Found $($sorted.Count) unique posts for UD.Home Engineering."

$out = ""
$idx = 1
foreach ($p in $sorted) {
    $out += "========================================================`n"
    $out += "POST #$idx`n"
    $out += "Date: $($p.time)`n"
    $out += "URL: $($p.url)`n"
    $out += "Likes: $($p.likes) | Comments: $($p.comments) | Shares: $($p.shares)`n"
    $out += "Content:`n$($p.text)`n`n"
    $idx++
}
Set-Content -Path 'scratch/udhome_10posts.txt' -Value $out -Encoding UTF8
Write-Output "Written posts to scratch/udhome_10posts.txt"
