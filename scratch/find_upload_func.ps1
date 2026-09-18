$app = Get-Content 'js/app.js' -Encoding UTF8
for ($i=0; $i -lt $app.Count; $i++) {
    if ($app[$i] -match 'function.*[Jj]son' -or $app[$i] -match 'function.*[Uu]pload' -or $app[$i] -match 'function.*[Aa]pify' -or $app[$i] -match 'function.*[Mm]atch') {
        Write-Output "Line $($i+1): $($app[$i])"
    }
}
