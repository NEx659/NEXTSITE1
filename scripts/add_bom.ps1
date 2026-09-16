param([string]$FilePath)
$b = [System.IO.File]::ReadAllBytes($FilePath)
if ($b.Length -ge 3 -and $b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF) {
    Write-Host "Already has BOM"
    exit 0
}
$list = New-Object System.Collections.Generic.List[byte]
$list.Add(0xEF)
$list.Add(0xBB)
$list.Add(0xBF)
$list.AddRange([byte[]]$b)
[System.IO.File]::WriteAllBytes($FilePath, $list.ToArray())
Write-Host "Added BOM to $FilePath"
