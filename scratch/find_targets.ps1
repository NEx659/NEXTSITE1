$content = [IO.File]::ReadAllText('js/data.js', [System.Text.Encoding]::UTF8)
$start = $content.IndexOf('[')
$end = $content.LastIndexOf(']')
$jsonText = $content.Substring($start, $end - $start + 1)
$list = $jsonText | ConvertFrom-Json

$targets = @(
    "ทีที ดีไซน์",
    "กิจดลวรโชติ",
    "กิตติศักดิ์",
    "ป. รุ่งเรือง",
    "ปิยภัทร125",
    "พีเอ แอนด์ ทีเอ็น",
    "ฟู่เฮ้าส์",
    "สันต์สิริ",
    "เอสดี เฮ้าส์",
    "อภิญญา"
)

foreach ($t in $targets) {
    $found = $list | Where-Object { $_.name -like "*$t*" }
    if ($found) {
        Write-Host "Found: $($found.id) | $($found.name) | District: $($found.district) | Address: $($found.address)"
    } else {
        Write-Host "NOT FOUND: $t"
    }
}
