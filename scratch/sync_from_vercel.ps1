$baseUrl = 'https://nextsite-ai.vercel.app/'
$destDir = 'c:\Users\pannipan\Downloads\N'

New-Item -ItemType Directory -Force -Path (Join-Path $destDir 'css') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $destDir 'js') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $destDir 'images') | Out-Null

function Download-Asset($relativeUrl, $destPath) {
    try {
        $fullUrl = $baseUrl + $relativeUrl
        Write-Output "Downloading $fullUrl -> $destPath"
        $wc = New-Object System.Net.WebClient
        $wc.Encoding = [System.Text.Encoding]::UTF8
        $content = $wc.DownloadString($fullUrl)
        [System.IO.File]::WriteAllText($destPath, $content, [System.Text.Encoding]::UTF8)
        Write-Output "✅ Saved $destPath (Length: $($content.Length))"
    } catch {
        Write-Output "❌ Failed to download $relativeUrl : $_"
    }
}

# 1. Download HTML -> index.html and NEX SAKON.html
Download-Asset '' (Join-Path $destDir 'index.html')
Copy-Item (Join-Path $destDir 'index.html') (Join-Path $destDir 'NEX SAKON.html') -Force

# 2. Download CSS
Download-Asset 'css/styles.css' (Join-Path $destDir 'css\styles.css')

# 3. Download JS files
Download-Asset 'js/data.js' (Join-Path $destDir 'js\data.js')
Download-Asset 'js/supabase.js' (Join-Path $destDir 'js\supabase.js')
Download-Asset 'js/scoring.js' (Join-Path $destDir 'js\scoring.js')
Download-Asset 'js/charts.js' (Join-Path $destDir 'js\charts.js')
Download-Asset 'js/map.js' (Join-Path $destDir 'js\map.js')
Download-Asset 'js/app.js' (Join-Path $destDir 'js\app.js')

# 4. Download images if available
try {
    $wcImg = New-Object System.Net.WebClient
    $wcImg.DownloadFile($baseUrl + 'images/kpi_city_skyline.jpg', (Join-Path $destDir 'images\kpi_city_skyline.jpg'))
    Write-Output "✅ Saved images\kpi_city_skyline.jpg"
} catch {
    Write-Output "Images note: $_"
}

Get-ChildItem $destDir -Recurse | Select-Object FullName, Length
