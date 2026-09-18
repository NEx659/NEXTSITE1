$bytes = [System.IO.File]::ReadAllBytes('c:\Users\pannipan\Downloads\N\scratch\dataset.json')
$text = [System.Text.Encoding]::UTF8.GetString($bytes)

Write-Output "Dataset text length: $($text.Length)"

$patterns = @('WonderCreation', 'Wonder', '45', 'วันเดอร์')
foreach ($p in $patterns) {
    $idx = $text.IndexOf($p, [System.StringComparison]::OrdinalIgnoreCase)
    Write-Output "Pattern '$p' index: $idx"
}
