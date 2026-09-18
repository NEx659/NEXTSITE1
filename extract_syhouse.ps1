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
                if ($item.pageName -like '*SYHOUSE*' -or $item.facebookUrl -like '*SYHOUSE*' -or $item.url -like '*SYHOUSE*') {
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

Set-Content -Path 'scratch/syhouse_posts.json' -Value ($sorted | ConvertTo-Json -Depth 5) -Encoding UTF8
Write-Output "Found $($sorted.Count) unique posts for SYHOUSECONSTRUCTION."

$idx = 1
foreach ($p in $sorted) {
    $firstLine = if ($p.text) { ($p.text -split "`n")[0] } else { "(no text)" }
    Write-Output "Post #$idx | Date: $($p.time) | URL: $($p.url)"
    Write-Output "First line: $firstLine"
    Write-Output "----------------------------------------"
    $idx++
}
