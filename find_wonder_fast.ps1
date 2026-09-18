$raw = Get-Content 'scratch/dataset.json' -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

$list = [System.Collections.Generic.List[object]]::new()
$i = 0
foreach ($item in $data) {
    $str = ($item | Out-String)
    if ($str -match 'Wonder' -or $str -match 'วันเดอร์' -or $str -match '45' -or $item.facebookUrl -match 'Wonder' -or $item.inputUrl -match 'Wonder') {
        $list.Add($item)
    }
    $i++
}

Write-Output "Found matching items: $($list.Count)"
$out = @()
$idx = 1
foreach ($item in $list) {
    $out += "=================== MATCH $idx ==================="
    $out += "URL: $($item.url)"
    $out += "FB_URL: $($item.facebookUrl)"
    $out += "INPUT_URL: $($item.inputUrl)"
    $out += "PAGE_NAME: $($item.pageName)"
    $out += "DATE: $($item.time) | $($item.date)"
    $out += "TEXT: $($item.text)"
    if ($item.images) {
        $out += "OCR: $(($item.images | ForEach-Object { $_.ocrText }) -join ' | ')"
    }
    $out += ""
    $idx++
}

Set-Content -Path 'scratch/wonder_matches.txt' -Value $out -Encoding UTF8
Write-Output "Written to scratch/wonder_matches.txt"
