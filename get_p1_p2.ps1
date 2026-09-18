$jsonText = [System.IO.File]::ReadAllText("$PSScriptRoot/dataset.json", [System.Text.Encoding]::UTF8)
$items = $jsonText | ConvertFrom-Json

$matched = [System.Collections.Generic.List[Object]]::new()
foreach ($item in $items) {
    $str = $item | ConvertTo-Json -Compress -Depth 2
    if ($str -match '100077712244902' -or $str -match 'Function Design' -or $str -match 'ฟังก์ชั่น ดีไซน์') {
        $matched.Add($item)
    }
}

Write-Output "--- EXACT DETAILS OF POST 1 ---"
$matched[0] | ConvertTo-Json -Depth 5

Write-Output "--- EXACT DETAILS OF POST 2 ---"
$matched[1] | ConvertTo-Json -Depth 5
