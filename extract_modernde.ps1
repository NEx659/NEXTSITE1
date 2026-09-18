$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json
$posts = @()
$seenUrls = @{}
foreach ($item in $data) {
    $itemUrl = $item.url
    $pageName = $item.pageName
    $fbUrl = $item.facebookUrl
    $text = $item.text
    if ($fbUrl -match 'MODERNDEHouseBuilder' -or $itemUrl -match 'MODERNDEHouseBuilder' -or $pageName -match 'MODERNDEHouseBuilder') {
        if (-not $seenUrls.ContainsKey($itemUrl)) {
            $seenUrls[$itemUrl] = $true
            $posts += [PSCustomObject]@{
                url = $itemUrl
                date = $item.time
                text = $text
                ocrText = if ($item.images) { ($item.images | ForEach-Object { $_.ocrText }) -join ' | ' } else { '' }
            }
        }
    }
}
Write-Output ('Total Modern De unique posts found: ' + $posts.Count)
$posts | ConvertTo-Json -Depth 5 | Out-File -FilePath 'scratch/modernde_posts.json' -Encoding UTF8