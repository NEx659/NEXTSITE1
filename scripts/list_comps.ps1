$data = Get-Content js/data.js -Raw
$matches = [regex]::Matches($data, '"name":\s*"([^"]+)"')
$idx = 1
foreach ($m in $matches) {
    Write-Host "$idx : $($m.Groups[1].Value)"
    $idx++
}
