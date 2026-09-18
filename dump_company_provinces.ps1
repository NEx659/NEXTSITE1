$content = Get-Content -Raw -Encoding UTF8 "$pwd/js/data.js"
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

$out = @()
foreach ($c in $companies) {
    # Convert province string to codepoints
    $chars = [char[]]$c.province
    $hex = ($chars | ForEach-Object { '{0:X4}' -f [int]$_ }) -join ' '
    $out += [PSCustomObject]@{
        id = $c.id
        name = $c.name
        province = $c.province
        hex = $hex
    }
}

$out | Format-Table -AutoSize | Out-String -Width 200 | Set-Content -Path "scratch/company_provinces_dump.txt" -Encoding UTF8
Write-Host "Dumped all 58 companies to scratch/company_provinces_dump.txt"
