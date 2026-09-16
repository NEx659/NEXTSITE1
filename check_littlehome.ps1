[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$files = Get-ChildItem "C:\Users\pannipan\Downloads\dataset_facebook-posts-scraper_*.json"
foreach ($f in $files) {
    Write-Host "========================================="
    Write-Host "File: $($f.Name)"
    $content = Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    $items = @()
    if ($content -is [array]) { $items = $content }
    elseif ($content.items) { $items = $content.items }
    
    Write-Host "Total items: $($items.Count)"
    $idx = 0
    foreach ($item in $items) {
        $txt = [string]$item.text
        $usr = if ($item.user) { [string]$item.user.name } else { "" }
        $page = [string]$item.pageName
        $url = [string]$item.url
        $fbUrl = [string]$item.facebookUrl
        $inputUrl = [string]$item.inputUrl
        
        if ($txt -match "หมูม่น" -or $txt -match "Little Home" -or $usr -match "Little Home" -or $page -match "Little Home" -or $url -match "little" -or $fbUrl -match "little" -or $inputUrl -match "little") {
            $idx++
            Write-Host "--- Match #$idx ---"
            Write-Host "User: $usr"
            Write-Host "PageName: $page"
            Write-Host "URL: $url"
            Write-Host "InputUrl: $inputUrl"
            Write-Host "FacebookUrl: $fbUrl"
            Write-Host "Text:`n$txt"
            Write-Host "-------------------"
        }
    }
}
