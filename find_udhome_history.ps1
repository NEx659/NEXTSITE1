$brainDir = "C:\Users\pannipan\.gemini\antigravity-ide\brain"
Get-ChildItem -Path $brainDir -Recurse -Filter "*.jsonl" | ForEach-Object {
    $file = $_.FullName
    [System.IO.File]::ReadLines($file, [System.Text.Encoding]::UTF8) | ForEach-Object {
        if ($_ -match 'comp-udon-11' -or $_ -match 'ยูดี.โฮมส์' -or $_ -match 'UD.Home') {
            if ($_ -match '"content":"([^"]*)"') {
                $c = $matches[1]
                if ($c.Length -gt 20) {
                    Write-Output "Found in $($file.Substring($brainDir.Length)): $($c.Substring(0, [Math]::Min(150, $c.Length)))"
                }
            }
        }
    }
}
