$jsonText = [System.IO.File]::ReadAllText("$PSScriptRoot/dataset.json", [System.Text.Encoding]::UTF8)
$items = $jsonText | ConvertFrom-Json

Write-Output "Total items in dataset.json: $($items.Count)"

$matches = @()
foreach ($item in $items) {
    $str = $item | ConvertTo-Json -Compress
    if ($str -match '100077712244902' -or $str -match 'Function Design' -or $str -match 'ฟังก์ชั่น ดีไซน์' -or $str -match 'ฟังก์ชั่น') {
        $matches += $item
    }
}

Write-Output "Matched posts count: $($matches.Count)"
$matches | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 "$PSScriptRoot/function_design_posts.json"
Write-Output "Saved to scratch/function_design_posts.json"
