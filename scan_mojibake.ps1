$content = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

Write-Host "Checking all $($companies.Count) companies for mojibake..."

$mojibakePattern = 'เธ|เน€|เน‚|เน‰|เนˆ|เนŠ|เน‹|เธฑ|เธฅ|เธก|เธฒ|เธฃ|เธต|เธ |เธ เนˆ|เธ”|เธ—|เธง|เธš|เธ™'

for ($i = 0; $i -lt $companies.Count; $i++) {
    $c = $companies[$i]
    $cStr = $c | ConvertTo-Json -Depth 5
    if ($cStr -match 'เธ[ญเธธเธ”|เธฑ|เธฅ|เธก|เธฒ|เธฃ|เธต|เธ |เน‰|เนˆ|เน€|เน‚|เนŠ|เน‹]') {
        Write-Host ">>> MOJIBAKE FOUND IN [$i] $($c.id) ($($c.name)) <<<"
    }
}
