$lines = Get-Content 'c:\Users\pannipan\Downloads\N\js\data.js' -Encoding UTF8
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'comp-udon-40') {
        Write-Output "Found comp-udon-40 at line $($i+1)"
        $start = [Math]::Max(0, $i - 2)
        $end = [Math]::Min($lines.Length - 1, $i + 100)
        for ($j = $start; $j -le $end; $j++) {
            Write-Output "$($j+1): $($lines[$j])"
            if ($lines[$j] -match '^\s*\},?\s*$' -and $j -gt ($i + 20)) {
                break
            }
        }
        break
    }
}
