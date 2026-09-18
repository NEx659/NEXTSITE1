$lines = Get-Content 'js/data.js' -Encoding UTF8
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'comp-udon-32') {
        Write-Output "Found comp-udon-32 at line $($i+1)"
        $start = [Math]::Max(0, $i - 2)
        $end = [Math]::Min($lines.Length - 1, $i + 50)
        for ($j = $start; $j -le $end; $j++) {
            Write-Output "$($j+1): $($lines[$j])"
        }
        break
    }
}
