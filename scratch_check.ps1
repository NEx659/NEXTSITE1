$files = Get-ChildItem 'c:\Users\pannipan\Downloads\dataset_facebook-posts-scraper*.json'
foreach ($f in $files) {
    try {
        $raw = Get-Content -LiteralPath $f.FullName -Raw | ConvertFrom-Json
        Write-Host "$($f.Name) : $($raw.Count)"
    } catch {
        Write-Host "$($f.Name) : error"
    }
}
