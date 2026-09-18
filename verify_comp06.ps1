[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = [System.IO.File]::ReadAllText("$PSScriptRoot/../js/data.js", [System.Text.Encoding]::UTF8)
$cleanJson = $raw -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
try {
    $companies = $cleanJson | ConvertFrom-Json
    Write-Output "SUCCESS: Parsed $($companies.Count) companies from js/data.js"
    $c06 = $companies | Where-Object { $_.id -eq "comp-udon-06" }
    if ($c06) {
        Write-Output "Found comp-udon-06: $($c06.name)"
        Write-Output "Projects count: $($c06.projects.Count)"
        foreach ($p in $c06.projects) {
            Write-Output " - Project: $($p.name) | Stage: $($p.stageKey) | Value: $($p.estValue)"
        }
    } else {
        Write-Output "comp-udon-06 NOT found!"
    }
} catch {
    Write-Output "JSON parse error: $_"
}
