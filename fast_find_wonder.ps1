$text = [System.IO.File]::ReadAllText('scratch/dataset.json', [System.Text.Encoding]::UTF8)

# Check if "WonderCreation" or "วันเดอร์" is anywhere in the file
$hasWonderCreation = $text.IndexOf("WonderCreation", [System.StringComparison]::OrdinalIgnoreCase) -ge 0
$hasWonder = $text.IndexOf("Wonder", [System.StringComparison]::OrdinalIgnoreCase) -ge 0
$hasThaiWonder = $text.IndexOf("วันเดอร์", [System.StringComparison]::OrdinalIgnoreCase) -ge 0
$hasComp45 = $text.IndexOf("comp-udon-45", [System.StringComparison]::OrdinalIgnoreCase) -ge 0

Write-Output "hasWonderCreation: $hasWonderCreation"
Write-Output "hasWonder: $hasWonder"
Write-Output "hasThaiWonder: $hasThaiWonder"
Write-Output "hasComp45: $hasComp45"

# Find all occurrences and context around them
$matches = [System.Text.RegularExpressions.Regex]::Matches($text, '.{0,100}(?:WonderCreation|วันเดอร์|Wonder).{0,200}', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
Write-Output "Total matches: $($matches.Count)"
$out = @()
$idx = 1
foreach ($m in $matches) {
    $out += "--- Match $idx ---"
    $out += $m.Value
    $out += ""
    $idx++
    if ($idx -gt 30) { break }
}
Set-Content -Path 'scratch/wonder_snippets.txt' -Value $out -Encoding UTF8
Write-Output "Saved snippets to scratch/wonder_snippets.txt"
