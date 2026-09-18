$wc = New-Object System.Net.WebClient
$wc.Encoding = [System.Text.Encoding]::UTF8
$d = $wc.DownloadString('https://nextsite-ai.vercel.app/js/data.js')
Write-Output "Downloaded data.js length: $($d.Length)"
[System.IO.File]::WriteAllText("$PSScriptRoot/vercel_data.js", $d, [System.Text.Encoding]::UTF8)
