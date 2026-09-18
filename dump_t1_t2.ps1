$raw = [System.IO.File]::ReadAllText("c:\Users\pannipan\Downloads\N\scratch\lecrown_posts.json", [System.Text.Encoding]::UTF8)
$posts = $raw | ConvertFrom-Json

$t1 = "pfbid0rVfH9LLAWSvuDVH4fdNUNa258aC7aFY4FbNVCgAir24grxZVH8GEE12Tah3N2vhpl"
$m1 = $posts | Where-Object { $_.url -like "*$t1*" -or $_.postUrl -like "*$t1*" }
Write-Output "=== T1 ==="
Write-Output "Date: $($m1.time)"
Write-Output "URL: $($m1.url)"
Write-Output "Text: $($m1.text)"

$t2 = "pfbid02j9rE7uijMrSWpHgJigTDhy1qLrYsNAbGBjtrZYnov9swQqfsDwNGQDGnCFWeBo2gl"
$m2 = $posts | Where-Object { $_.url -like "*$t2*" -or $_.postUrl -like "*$t2*" }
Write-Output "=== T2 ==="
Write-Output "Date: $($m2.time)"
Write-Output "URL: $($m2.url)"
Write-Output "Text: $($m2.text)"
