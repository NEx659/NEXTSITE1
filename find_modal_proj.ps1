$app = Get-Content 'js/app.js' -Encoding UTF8
for ($i=0; $i -lt $app.Count; $i++) {
    if ($app[$i] -match 'เปิดดูโพสต์' -or $app[$i] -match 'facebookPostUrl' -or $app[$i] -match 'renderCompanyProjectsList') {
        Write-Output "Line $($i+1): $($app[$i])"
    }
}
