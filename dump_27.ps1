$content = Get-Content -Encoding UTF8 scratch/banwisawa_posts.json -Raw
$posts = $content | ConvertFrom-Json
$out = ""
for ($i = 0; $i -lt $posts.Count; $i++) {
    $p = $posts[$i]
    $num = $i + 1
    $out += "`n==================== POST $num ====================`n"
    $out += "Date: " + $p.date + " | Time: " + $p.time + "`n"
    $out += "URL: " + $p.url + "`n"
    $out += "Text: `n" + $p.text + "`n"
}
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\scratch\banwisawa_all_text.txt", $out, [System.Text.Encoding]::UTF8)
