$lines = Get-Content 'js/app.js'
$d = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    $o = ($line.ToCharArray() | Where-Object { $_ -eq '[' }).Count
    $c = ($line.ToCharArray() | Where-Object { $_ -eq ']' }).Count
    $d += ($o - $c)
    if ($o -ne $c) {
        Write-Host "Line $($i+1) [delta=$($o-$c), total=$d]: $line"
    }
}
Write-Host "End of file total: $d"
