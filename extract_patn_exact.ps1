$queryObj = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/patn_query.json", [System.Text.Encoding]::UTF8) | ConvertFrom-Json
$queries = $queryObj.queryList

$raw = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/dataset.json", [System.Text.Encoding]::UTF8)
$dataset = $raw | ConvertFrom-Json
Write-Host "Total items in dataset: $($dataset.Count)"

$patnPosts = @()

foreach ($item in $dataset) {
    $str = $item | ConvertTo-Json -Depth 4
    $isMatch = $false
    # Check if from PATN page or contains phone/keywords
    if ($item.url -like "*PATN*" -or $item.pageName -like "*PATN*" -or $str -like "*098*834*3732*" -or $str -like "*098*585*8741*") {
        $isMatch = $true
    } else {
        foreach ($q in $queries) {
            if ($str.IndexOf($q, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
                # Ensure it's not a generic word unless associated
                if ($q -eq "PATN2021" -or $q -eq "0988343732" -or $q -eq "0985858741" -or $q -eq "098-834-3732" -or $q -eq "098-585-8741") {
                    $isMatch = $true
                    break
                }
            }
        }
    }
    if ($isMatch) {
        $patnPosts += $item
    }
}

Write-Host "PATN exact matches found: $($patnPosts.Count)"

$out = ""
$idx = 1
foreach ($item in $patnPosts) {
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

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/scratch/patn_exact_posts.txt", $out, [System.Text.Encoding]::UTF8)
Write-Host "Saved to patn_exact_posts.txt"
