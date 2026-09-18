$content = Get-Content -Encoding UTF8 -Path "index.html"
for ($i = 0; $i -lt $content.Count; $i++) {
    if ($content[$i] -match "facebook" -or $content[$i] -match "postUrl" -or $content[$i] -match "modal" -or $content[$i] -match "projects") {
        Write-Output ("Line " + ($i + 1) + ": " + $content[$i].Trim())
    }
}
