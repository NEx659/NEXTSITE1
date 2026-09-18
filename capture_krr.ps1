[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$lines = Get-Content -Path "scratch/dataset.json" -Encoding UTF8
$krrLines = @()
$recording = $false
$braceCount = 0

for ($i = 27170; $i -lt [Math]::Min($lines.Length, 35000); $i++) {
    $line = $lines[$i]
    if ($line -match '"facebookUrl":\s*"https://www.facebook.com/profile.php\?id=61558614631187"') {
        $recording = $true
    }
    if ($recording) {
        $krrLines += $line
        if ($line -match '"inputUrl":' -and $line -notmatch '61558614631187') {
            break
        }
    }
}

$rawJson = "[" + ($krrLines -join "`n")
# find matching array
Set-Content -Path "scratch/krr_raw_lines.txt" -Value ($krrLines -join "`n") -Encoding UTF8
Write-Output "Captured $($krrLines.Length) lines"
