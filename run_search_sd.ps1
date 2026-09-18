$queryObj = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/sd_query.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json
$queries = $queryObj.queryList

$raw = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/dataset.json", [System.Text.Encoding]::UTF8)
$dataset = $raw | ConvertFrom-Json
Write-Host "Total items in dataset: $($dataset.Count)"

$sdPosts = @()

foreach ($item in $dataset) {
    $str = $item | ConvertTo-Json -Depth 4
    $isMatch = $false
    foreach ($q in $queries) {
        if ($str.IndexOf($q, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
            $isMatch = $true
            break
        }
    }
    if ($isMatch) {
        $sdPosts += $item
    }
}

Write-Host "SD matches found: $($sdPosts.Count)"
$sdJson = $sdPosts | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/scratch/sd_posts.json", $sdJson, [System.Text.Encoding]::UTF8)

$out = ""
$idx = 1
foreach ($item in $sdPosts) {
    $time = $item.time
    $url = $item.url
    $likes = $item.likes
    $comments = $item.comments
    $shares = $item.shares
    $text = $item.text
    
    $out += "==================================================" + [Environment]::NewLine
    $out += "POST_$idx" + [Environment]::NewLine
    $out += "TIME: $time" + [Environment]::NewLine
    $out += "URL: $url" + [Environment]::NewLine
    $out += "LIKES: $likes | COMMENTS: $comments | SHARES: $shares" + [Environment]::NewLine
    $out += "TEXT:" + [Environment]::NewLine
    $out += "$text" + [Environment]::NewLine
    $out += "==================================================" + [Environment]::NewLine + [Environment]::NewLine
    $idx++
}

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/scratch/sd_10posts_clean.txt", $out, [System.Text.Encoding]::UTF8)
Write-Host "Saved to sd_10posts_clean.txt"

# Check data.js
$c = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $c.Substring($c.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

for ($i=0; $i -lt $companies.Count; $i++) {
    $compStr = $companies[$i] | ConvertTo-Json -Depth 4
    foreach ($q in $queries) {
        if ($compStr.IndexOf($q, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
            Write-Host "Found in data.js -> Index: $i | ID: $($companies[$i].id) | Name: $($companies[$i].name) | Eng: $($companies[$i].engName)"
            break
        }
    }
}
