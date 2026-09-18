$bytes = [System.IO.File]::ReadAllBytes("$pwd/js/data.js")
$text = [System.Text.Encoding]::UTF8.GetString($bytes)

# Let's check for any mojibake sequences like 'เธ' in text
$matchesMojibake = [regex]::Matches($text, 'เธ[^\s",]+')
Write-Host "Mojibake matches count: $($matchesMojibake.Count)"

foreach ($m in $matchesMojibake | Select-Object -First 20) {
    Write-Host "Sample mojibake: $($m.Value)"
}
