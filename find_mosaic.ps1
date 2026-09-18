$data = Get-Content 'js/data.js' -Encoding UTF8
for ($i=0; $i -lt $data.Count; $i++) {
    if ($data[$i] -match 'โมเสค' -or $data[$i] -match 'mosaic' -or $data[$i] -match '100083320623771') {
        Write-Output "data.js Line $($i+1): $($data[$i])"
    }
}

$app = Get-Content 'js/app.js' -Encoding UTF8
for ($i=0; $i -lt $app.Count; $i++) {
    if ($app[$i] -match 'โมเสค' -or $app[$i] -match 'mosaic' -or $app[$i] -match '100083320623771') {
        Write-Output "app.js Line $($i+1): $($app[$i])"
    }
}
