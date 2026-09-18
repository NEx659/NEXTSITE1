$url = 'https://nextsite-ai.vercel.app'
$req = [System.Net.HttpWebRequest]::Create($url)
$req.UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
$resp = $req.GetResponse()
$stream = $resp.GetResponseStream()
$reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
$html = $reader.ReadToEnd()
$reader.Close()
$resp.Close()

Write-Output "Downloaded HTML Length: $($html.Length)"
[System.IO.File]::WriteAllText('c:\Users\pannipan\Downloads\N\scratch\vercel_live.html', $html, [System.Text.Encoding]::UTF8)

# Find all scripts and stylesheets in the live HTML
$matchesCss = [regex]::Matches($html, 'href=["'']([^"'']+\.css[^"'']*)["'']')
foreach ($m in $matchesCss) {
    Write-Output "CSS Asset: $($m.Groups[1].Value)"
}

$matchesJs = [regex]::Matches($html, 'src=["'']([^"'']+\.js[^"'']*)["'']')
foreach ($m in $matchesJs) {
    Write-Output "JS Asset: $($m.Groups[1].Value)"
}
