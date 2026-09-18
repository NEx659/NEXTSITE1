$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json
$posts = @()
$seenUrls = @{}
foreach ($item in $data) {
    $itemUrl = $item.url
    $pageName = $item.pageName
    $name = $item.user.name
    $fbUrl = $item.facebookUrl
    $text = $item.text
    if ($fbUrl -match 'ฟ้าสว่าง' -or $itemUrl -match 'ฟ้าสว่าง' -or $pageName -match 'ฟ้าสว่าง' -or $name -match 'ฟ้าสว่าง' -or $text -match 'ฟ้าสว่าง' -or $fbUrl -match 'fasawang') {
        if (-not $seenUrls.ContainsKey($itemUrl) -and $itemUrl) {
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
Write-Output ('Total Fasawang unique posts found: ' + $posts.Count)
$posts | ConvertTo-Json -Depth 5 | Out-File -FilePath 'scratch/fasawang_posts.json' -Encoding UTF8