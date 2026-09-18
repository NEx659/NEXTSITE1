$url = 'https://nextsite-ai.vercel.app/js/data.js'
$req = [System.Net.HttpWebRequest]::Create($url)
$req.UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
$resp = $req.GetResponse()
$stream = $resp.GetResponseStream()
$reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
$dataJs = $reader.ReadToEnd()
$reader.Close()
$resp.Close()

[System.IO.File]::WriteAllText('c:\Users\pannipan\Downloads\N\js\data.js', $dataJs, [System.Text.Encoding]::UTF8)
Write-Output "Downloaded clean data.js: Length $($dataJs.Length)"
