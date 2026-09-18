$url = 'https://nextsite-ai.vercel.app/report.html'
try {
    $req = [System.Net.HttpWebRequest]::Create($url)
    $req.UserAgent = 'Mozilla/5.0'
    $resp = $req.GetResponse()
    $stream = $resp.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
    $html = $reader.ReadToEnd()
    $reader.Close()
    $resp.Close()
    Write-Output "Found report.html on Vercel! Length: $($html.Length)"
    [System.IO.File]::WriteAllText('c:\Users\pannipan\Downloads\N\report.html', $html, [System.Text.Encoding]::UTF8)
} catch {
    Write-Output "HTTP Error: $_"
}
