[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = Get-Content 'js/data.js' -Raw -Encoding UTF8
$cleaned = $raw -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
try {
    $obj = ConvertFrom-Json $cleaned
    Write-Output "JSON Syntax Valid! Total Companies: $($obj.Count)"
    $bandee = $obj | Where-Object { $_.id -eq 'comp-udon-52' }
    Write-Output "Bandee company: $($bandee.name) (ID: $($bandee.id))"
    Write-Output "Projects count: $($bandee.projects.Count)"
    foreach ($p in $bandee.projects) {
        Write-Output "- Project ID: $($p.projectId) | siteKey: $($p.siteKey) | Name: $($p.name) | URL: $($p.postUrl)"
    }
} catch {
    Write-Error $_.Exception.Message
}
