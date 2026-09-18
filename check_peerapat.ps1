$data = Get-Content -Raw -Encoding UTF8 'c:\Users\pannipan\Downloads\N\scratch\dataset.json' | ConvertFrom-Json
$posts = @()
foreach ($item in $data) {
    if (($item.url -and $item.url -like "*100066777634252*") -or 
        ($item.facebookUrl -and $item.facebookUrl -like "*100066777634252*") -or 
        ($item.inputUrl -and $item.inputUrl -like "*100066777634252*") -or
        ($item.pageName -and ($item.pageName -like "*พีรพัฒน์*" -or $item.pageName -like "*999*")) -or
        ($item.user -and $item.user.name -and ($item.user.name -like "*พีรพัฒน์*" -or $item.user.name -like "*999*"))) {
        $posts += $item
    }
}

$out = @()
$out += "TOTAL POSTS: $($posts.Count)"
$i = 1
foreach ($p in $posts) {
    $out += "-------------------- POST $i --------------------"
    $out += "URL: $($p.url)"
    $out += "TIME: $($p.time) | $($p.date)"
    $out += "PAGE/USER: $($p.pageName) | $($p.user.name)"
    $out += "TEXT: $($p.text)"
    $out += ""
    $i++
}
Set-Content -Path 'c:\Users\pannipan\Downloads\N\scratch\peerapat_posts_clean.txt' -Value $out -Encoding UTF8
