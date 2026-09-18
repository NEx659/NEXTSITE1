$content = Get-Content -Raw -Encoding UTF8 "js/data.js"
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

Write-Host "Loaded $($companies.Count) companies"

# Thai string for "อุดรธานี"
$udonStr = "$([char]0x0E2D)$([char]0x0E38)$([char]0x0E14)$([char]0x0E23)$([char]0x0E18)$([char]0x0E32)$([char]0x0E19)$([char]0x0E35)"

foreach ($c in $companies) {
    # Fix province to clean "อุดรธานี"
    $c.province = $udonStr
}

# Explicitly fix comp-udon-58 name
$c58 = $companies | Where-Object { $_.id -eq 'comp-udon-58' }
if ($c58) {
    $c58.name = "$([char]0x0E2B)$([char]0x0E49)$([char]0x0E32)$([char]0x0E07)$([char]0x0E2build_placeholder)ห้างหุ้นส่วนจำกัด โมเสคดีไซน์ แอนด์ คอนสตรัคชั่น"
}

# Let's write as clean UTF-8
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("$pwd/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Done fixing provinces!"
