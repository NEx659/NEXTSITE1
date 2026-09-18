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
    if ($fbUrl -match 'Karin' -or $itemUrl -match 'Karin' -or $pageName -match 'การิน' -or $name -match 'การิน' -or $text -match 'การินบ้านสวย') {
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
Write-Output ('Total Karin Bansuay unique posts found: ' + $posts.Count)
$posts | ConvertTo-Json -Depth 5 | Out-File -FilePath 'scratch/karin_posts.json' -Encoding UTF8