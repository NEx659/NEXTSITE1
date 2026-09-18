$lines = [System.IO.File]::ReadAllLines("c:\Users\pannipan\Downloads\N\js\data.js", [System.Text.Encoding]::UTF8)
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "comp-udon-43") {
        Write-Output ("Line " + ($i+1) + ": " + $lines[$i])
        for ($j = $i; $j -lt [Math]::Min($i + 15, $lines.Length); $j++) {
            Write-Output ("  " + $lines[$j])
        }
        break
    }
}
