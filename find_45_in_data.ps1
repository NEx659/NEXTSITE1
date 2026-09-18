$lines = Get-Content 'js/data.js' -Encoding UTF8
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'วันเดอร์' -or $lines[$i] -match 'comp-udon-45' -or $lines[$i] -match 'Wonder') {
        Write-Output "Found in data.js at line $($i+1): $($lines[$i])"
        $start = [Math]::Max(0, $i - 5)
        $end = [Math]::Min($lines.Length - 1, $i + 45)
        for ($j = $start; $j -le $end; $j++) {
            Write-Output "$($j+1): $($lines[$j])"
        }
        break
    }
}
