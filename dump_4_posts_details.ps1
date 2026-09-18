$raw = [System.IO.File]::ReadAllText("c:\Users\pannipan\Downloads\N\scratch\lecrown_posts.json", [System.Text.Encoding]::UTF8)
$posts = $raw | ConvertFrom-Json
$targets = @(
    "pfbid0rVfH9LLAWSvuDVH4fdNUNa258aC7aFY4FbNVCgAir24grxZVH8GEE12Tah3N2vhpl",
    "pfbid02j9rE7uijMrSWpHgJigTDhy1qLrYsNAbGBjtrZYnov9swQqfsDwNGQDGnCFWeBo2gl",
    "pfbid02rU2BVqUHJy1D6ihsdBnFRekumQYA5HRXUFqATa6f6Df4NintbDjGoFcRFGaoZ2WYl",
    "pfbid02CaPNknaZZwo17sHctBhvpyjD76ywJ6NAWfodQNq6PAzp6E4ZBbHag2SXLQSwVK7jl"
)

foreach ($t in $targets) {
    Write-Output "--------------------------------------------------"
    Write-Output "TARGET: $t"
    $match = $posts | Where-Object { $_.url -like "*$t*" -or $_.postUrl -like "*$t*" }
    if ($match) {
        $d = if ($match.time) { $match.time } else { $match.date }
        $u = if ($match.url) { $match.url } else { $match.postUrl }
        $txt = if ($match.text) { $match.text } else { $match.caption }
        Write-Output "Date: $d"
        Write-Output "URL: $u"
        Write-Output "Text: $txt"
    } else {
        Write-Output "No match"
    }
}
