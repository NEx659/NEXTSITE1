$bytes = [System.IO.File]::ReadAllBytes('c:\Users\pannipan\Downloads\N\scratch\dataset.json')
$text = [System.Text.Encoding]::UTF8.GetString($bytes)

$idx = $text.IndexOf('WonderCreation', [System.StringComparison]::OrdinalIgnoreCase)
$start = [Math]::Max(0, $idx - 500)
$len = [Math]::Min(15000, $text.Length - $start)
$sub = $text.Substring($start, $len)

[System.IO.File]::WriteAllText('c:\Users\pannipan\Downloads\N\scratch\wonder_raw.txt', $sub, [System.Text.Encoding]::UTF8)
Write-Output "Written 15KB snippet around index $idx"
