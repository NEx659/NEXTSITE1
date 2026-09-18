$bytes = [System.IO.File]::ReadAllBytes('c:\Users\pannipan\Downloads\N\scratch\dataset.json')
$text = [System.Text.Encoding]::UTF8.GetString($bytes)

$pos = 0
$occurrences = @()
while (($pos = $text.IndexOf('Wonder', $pos, [System.StringComparison]::OrdinalIgnoreCase)) -ge 0) {
    $occurrences += $pos
    $pos += 6
}

Write-Output "Total 'Wonder' occurrences: $($occurrences.Count)"
foreach ($o in $occurrences) {
    $st = [Math]::Max(0, $o - 100)
    $len = [Math]::Min(300, $text.Length - $st)
    Write-Output "--- At $o ---"
    Write-Output $text.Substring($st, $len)
}
