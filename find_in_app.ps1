$content = Get-Content -Encoding UTF8 -Path "js/app.js"
for ($i = 0; $i -lt $content.Count; $i++) {
    if ($content[$i] -match "facebook" -or $content[$i] -match "postUrl" -or $content[$i] -match "renderModal" -or $content[$i] -match "openModal" -or $content[$i] -match "openCompanyModal") {
        Write-Output ("Line " + ($i + 1) + ": " + $content[$i].Trim())
    }
}
