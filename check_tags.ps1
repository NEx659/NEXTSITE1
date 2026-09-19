$c = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $c.Substring($c.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

$tags = @{}
foreach ($comp in $companies) {
    $t = [string]$comp.tag
    if (-not $tags.ContainsKey($t)) { $tags[$t] = 0 }
    $tags[$t]++
}

foreach ($k in $tags.Keys) {
    Write-Host "$k : $($tags[$k])"
}
