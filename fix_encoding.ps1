$content = Get-Content -Raw -Encoding UTF8 "$pwd/js/data.js"
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

Write-Host "Loaded $($companies.Count) companies"

# If any company has mojibake province or corrupted text, let's fix it
# In fact, we can decode any double-UTF8 mojibake or set province = "อุดรธานี" for all Udon companies

$utf8 = [System.Text.Encoding]::UTF8
$ansi = [System.Text.Encoding]::GetEncoding(874) # or default 1252 / binary

foreach ($c in $companies) {
    # Check if name has mojibake chars like 'เธ'
    if ($c.name -match 'เธ' -or $c.province -match 'เธ') {
        Write-Host "Fixing mojibake for ID: $($c.id)"
        
        # Helper function to fix double-encoded UTF8 string
        $bytes = [System.Text.Encoding]::GetEncoding(1252).GetBytes($c.name)
        try {
            $fixedName = $utf8.GetString($bytes)
            if ($fixedName -notmatch '' -and $fixedName.Length -gt 2) {
                $c.name = $fixedName
            }
        } catch {}

        # Ensure province is clean
        $c.province = "อุดรธานี"
        
        # Fix caption if needed
        if ($c.facebookSignal -and $c.facebookSignal.caption -match 'เธ') {
            try {
                $bCap = [System.Text.Encoding]::GetEncoding(1252).GetBytes($c.facebookSignal.caption)
                $fCap = $utf8.GetString($bCap)
                if ($fCap -notmatch '') { $c.facebookSignal.caption = $fCap }
            } catch {}
        }
    } else {
        # Ensure province is exactly clean "อุดรธานี"
        if ($c.province -ne "สกลนคร" -and $c.province -ne "หนองคาย") {
            $c.province = "อุดรธานี"
        }
    }
}

# Serialize cleanly to JSON and write to js/data.js as UTF8 without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("$pwd/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Written clean UTF-8 without BOM to js/data.js"
