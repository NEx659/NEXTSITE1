[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = Get-Content 'js/data.js' -Raw -Encoding UTF8
$pattern = '\"id\":\s*\"([^\"]+)\",\s*\"name\":\s*\"([^\"]+)\"'
$regex = New-Object System.Text.RegularExpressions.Regex($pattern)
$matches = $regex.Matches($raw)

$sb = [System.Text.StringBuilder]::new()
foreach ($m in $matches) {
    [void]$sb.AppendLine("$($m.Groups[1].Value) | $($m.Groups[2].Value)")
}

Set-Content -Path "scratch/companies_list.txt" -Value $sb.ToString() -Encoding UTF8
Write-Output "Found $($matches.Count) companies"
