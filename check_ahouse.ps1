$data = Get-Content -Raw -Encoding UTF8 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' | ConvertFrom-Json
$ahouse = @()
foreach ($item in $data) {
    if (($item.url -and $item.url -like "*ahouse.builder*") -or 
        ($item.facebookUrl -and $item.facebookUrl -like "*ahouse.builder*") -or 
        ($item.inputUrl -and $item.inputUrl -like "*ahouse.builder*")) {
        $ahouse += $item
    }
}

$out = @()
$out += "TOTAL A HOUSE POSTS: $($ahouse.Count)"
$i = 1
foreach ($p in $ahouse) {
    $out += "-------------------- POST $i --------------------"
    $out += "URL: $($p.url)"
    $out += "TIME: $($p.time) | $($p.date)"
    $out += "TEXT: $($p.text)"
    $out += ""
    $i++
}
Set-Content -Path 'c:\Users\pannipan\Downloads\N\scratch\ahouse_posts_clean.txt' -Value $out -Encoding UTF8
