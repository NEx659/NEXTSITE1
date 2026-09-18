$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

$matches = @()
foreach ($item in $data) {
    $str = ($item | ConvertTo-Json -Compress)
    if ($str -match 'WonderCreation' -or $str -match 'wonder' -or $str -match 'วันเดอร์') {
        $matches += $item
    }
}

Write-Output "Matches: $($matches.Count)"
$matches | ConvertTo-Json -Depth 5 | Set-Content 'scratch/wonder_matches.json' -Encoding UTF8
