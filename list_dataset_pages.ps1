$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

$pages = @{}
foreach ($item in $data) {
    $fb = if ($item.facebookUrl) { $item.facebookUrl } elseif ($item.inputUrl) { $item.inputUrl } else { "unknown" }
    $pages[$fb]++
}

$out = @()
$pages.GetEnumerator() | Sort-Object Name | ForEach-Object {
    $out += "$($_.Name) | count: $($_.Value)"
}

Set-Content -Path 'scratch/all_dataset_pages.txt' -Value $out -Encoding UTF8
Write-Output "Total unique pages in dataset: $($pages.Count)"
