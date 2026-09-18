# Let's inspect dataset.json to see how many posts each company/page has in dataset.json
$dataset = Get-Content -Raw -Encoding UTF8 "scratch/dataset.json" | ConvertFrom-Json
Write-Host "Total items in dataset.json: $($dataset.Count)"

# Let's group all items by user.name / page name
$pages = @{}
foreach ($item in $dataset) {
    $pname = if ($item.user -and $item.user.name) { $item.user.name } else { "UNKNOWN" }
    if (-not $pages.ContainsKey($pname)) { $pages[$pname] = 0 }
    $pages[$pname]++
}

Write-Host "=== Pages and Post counts in dataset.json ==="
$pages.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    Write-Host "$($_.Key) : $($_.Value) posts"
}
