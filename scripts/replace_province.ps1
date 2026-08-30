$files = @(
    "C:\Users\pannipan\Downloads\N\NEX SAKON.html",
    "C:\Users\pannipan\Downloads\N\index.html",
    "C:\Users\pannipan\Downloads\N\js\app.js",
    "C:\Users\pannipan\Downloads\N\js\map.js",
    "C:\Users\pannipan\Downloads\N\js\charts.js",
    "C:\Users\pannipan\Downloads\N\js\scoring.js"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
        $content = $content.Replace('สกลนคร', 'อุดรธานี')
        $content = $content.Replace('Sakon Nakhon', 'Udon Thani')
        $content = $content.Replace('SAKON', 'UDON')
        $content = $content.Replace('19 บริษัท', '33 บริษัท')
        $content = $content.Replace('19 เพจ', '33 เพจ')
        $content = $content.Replace('โซนสกลนคร', 'โซนอุดรธานี')
        $content = $content.Replace('ทั่วสกลนคร', 'ทั่วอุดรธานี')
        $content = $content.Replace('ในสกลนคร', 'ในอุดรธานี')
        $content = $content.Replace('จ.สกล', 'จ.อุดร')
        [System.IO.File]::WriteAllText($f, $content, [System.Text.Encoding]::UTF8)
        Write-Output "Successfully updated: $f"
    }
}
