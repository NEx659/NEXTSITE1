$lines = Get-Content 'scratch/wonder_matches.txt' -Encoding UTF8
$pnames = @{}
$urls = @{}
foreach ($line in $lines) {
    if ($line -match '^PAGE_NAME:\s*(.+)$') {
        $pnames[$matches[1]]++
    }
    if ($line -match '^FB_URL:\s*(.+)$') {
        $urls[$matches[1]]++
    }
}
Write-Output "Unique Page Names:"
$pnames.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object { "$($_.Name) ($($_.Value))" }
Write-Output "`nUnique FB URLs:"
$urls.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object { "$($_.Name) ($($_.Value))" }
