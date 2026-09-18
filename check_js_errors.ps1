$files = @("js/data.js", "js/app.js", "js/scoring.js", "js/map.js", "js/charts.js", "js/supabase.js")

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content -Raw -Encoding UTF8 $f
        Write-Host "File: $f (Length: $($content.Length))"
    } else {
        Write-Host "Missing: $f"
    }
}

# Check if data.js is valid JSON inside var UDON_COMPANIES = ...;
$dataRaw = Get-Content -Raw -Encoding UTF8 "js/data.js"
$prefix = "var UDON_COMPANIES = "
$trimmed = $dataRaw.Trim()
if ($trimmed.StartsWith($prefix)) {
    $json = $trimmed.Substring($prefix.Length)
    if ($json.EndsWith(";")) {
        $json = $json.Substring(0, $json.Length - 1).Trim()
    }
    try {
        $obj = $json | ConvertFrom-Json
        Write-Host "data.js parsed successfully! Count: $($obj.Count)"
        $c11 = $obj | Where-Object { $_.id -eq 'comp-udon-11' }
        Write-Host "comp-udon-11 name: $($c11.name)"
        Write-Host "comp-udon-11 projects count: $($c11.projects.Count)"
        foreach ($p in $c11.projects) {
            Write-Host "  -> [$($p.projectId)] $($p.name) : $($p.postUrl)"
        }
    } catch {
        Write-Host "JSON Parse ERROR in data.js: $($_.Exception.Message)"
    }
} else {
    Write-Host "data.js does not start with var UDON_COMPANIES = "
}
