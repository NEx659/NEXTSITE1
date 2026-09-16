$posts = Get-Content 'scripts/facebook_54_pages_posts.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$mindPosts = $posts | Where-Object { 
    $_.facebookUrl -like "*MindHome.Grand*" -or 
    $_.url -like "*MindHome.Grand*" -or 
    $_.inputUrl -like "*MindHome.Grand*" -or 
    $_.pageName -eq "MindHome.Grand"
}

Write-Host "Simulating project extraction for MindHome.Grand:"

$udonTerms = @(
    'อำเภอเมือง จังหวัดอุดรธานี', 'อำเภอเมือง จังหวัดอุดร', 'อ.เมือง จังหวัดอุดรธานี', 'อ.เมือง จังหวัดอุดร',
    'เมือง จังหวัดอุดรธานี', 'เมือง จังหวัดอุดร', 'อำเภอเมืองอุดรธานี', 'อำเภอเมืองอุดร', 'อ.เมือง จ.อุดร', 'อ.เมือง อุดร',
    'อ.เมืองอุดร', 'เมืองอุดรธานี', 'เมืองอุดร', 'ในเมืองอุดร', 'ในเมือง จ.อุดร', 'ในเมือง', 'อำเภอเมือง', 'อ.เมือง'
)

$i = 1
foreach ($p in $mindPosts) {
    $t = $p.text.ToLower()
    $detected = $null
    
    foreach ($term in $udonTerms) {
        if ($t.Contains($term.ToLower())) {
            $detected = "อุดรธานี (เมืองอุดรธานี)"
            break
        }
    }
    if (-not $detected) {
        if ($t.Contains("สว่างแดนดิน") -or $t.Contains("สกลนคร")) {
            $detected = "สกลนคร (สว่างแดนดิน)"
        } elseif ($t.Contains("ขอนแก่น")) {
            $detected = "ขอนแก่น"
        }
    }
    
    Write-Host "`n[$i] URL: $($p.url)"
    Write-Host "    Detected Location: $detected"
    Write-Host "    Snippet: $(($p.text -replace '\n', ' ').Substring(0, [math]::Min(100, $p.text.Length)))"
    $i++
}
