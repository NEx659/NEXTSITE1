$sakon = [string]::Join('', @([char]0x0E2A, [char]0x0E01, [char]0x0E25, [char]0x0E19, [char]0x0E02, [char]0x0E23)) # สกลนคร
$udon = [string]::Join('', @([char]0x0E2D, [char]0x0E38, [char]0x0E14, [char]0x0E23, [char]0x0E18, [char]0x0E32, [char]0x0E19, [char]0x0E35)) # อุดรธานี

$sakon_short = [string]::Join('', @([char]0x0E2A, [char]0x0E01, [char]0x0E25)) # สกล
$udon_short = [string]::Join('', @([char]0x0E2D, [char]0x0E38, [char]0x0E14, [char]0x0E23)) # อุดร

$nineteen_comps = "19 " + [string]::Join('', @([char]0x0E1A, [char]0x0E23, [char]0x0E34, [char]0x0E29, [char]0x0E31, [char]0x0E17)) # 19 บริษัท
$thirtythree_comps = "33 " + [string]::Join('', @([char]0x0E1A, [char]0x0E23, [char]0x0E34, [char]0x0E29, [char]0x0E31, [char]0x0E17)) # 33 บริษัท

$nineteen_pages = "19 " + [string]::Join('', @([char]0x0E40, [char]0x0E1E, [char]0x0E08)) # 19 เพจ
$thirtythree_pages = "33 " + [string]::Join('', @([char]0x0E40, [char]0x0E1E, [char]0x0E08)) # 33 เพจ

$files = @(
    "C:\Users\pannipan\Downloads\N\NEX SAKON.html",
    "C:\Users\pannipan\Downloads\N\index.html",
    "C:\Users\pannipan\Downloads\N\js\app.js",
    "C:\Users\pannipan\Downloads\N\js\map.js",
    "C:\Users\pannipan\Downloads\N\js\charts.js",
    "C:\Users\pannipan\Downloads\N\js\scoring.js"
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($f in $files) {
    if (Test-Path $f) {
        $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
        $text = $text.Replace($sakon, $udon)
        $text = $text.Replace("Sakon Nakhon", "Udon Thani")
        $text = $text.Replace("SAKON", "UDON")
        $text = $text.Replace($nineteen_comps, $thirtythree_comps)
        $text = $text.Replace($nineteen_pages, $thirtythree_pages)
        $text = $text.Replace($sakon_short, $udon_short)
        [System.IO.File]::WriteAllText($f, $text, $utf8NoBom)
        Write-Output "Processed: $f"
    }
}
