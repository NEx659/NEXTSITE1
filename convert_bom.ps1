$p = "scripts/pull_all_raw_posts.ps1"
$txt = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
$utf8BOM = New-Object System.Text.UTF8Encoding $true
[System.IO.File]::WriteAllText($p, $txt, $utf8BOM)
Write-Host "Converted to UTF-8 with BOM"

