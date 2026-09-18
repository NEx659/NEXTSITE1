$datasetFiles = Get-ChildItem -Path "c:\Users\pannipan\Downloads\N" -Filter "*.json" -Recurse
$targets = @(
    "pfbid0rVfH9LLAWSvuDVH4fdNUNa258aC7aFY4FbNVCgAir24grxZVH8GEE12Tah3N2vhpl",
    "pfbid02j9rE7uijMrSWpHgJigTDhy1qLrYsNAbGBjtrZYnov9swQqfsDwNGQDGnCFWeBo2gl",
    "pfbid02rU2BVqUHJy1D6ihsdBnFRekumQYA5HRXUFqATa6f6Df4NintbDjGoFcRFGaoZ2WYl",
    "pfbid02CaPNknaZZwo17sHctBhvpyjD76ywJ6NAWfodQNq6PAzp6E4ZBbHag2SXLQSwVK7jl"
)

foreach ($target in $targets) {
    Write-Output "=================================================="
    Write-Output "TARGET: $target"
    foreach ($file in $datasetFiles) {
        if ($file.FullName -like "*node_modules*" -or $file.FullName -like "*.git*") { continue }
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        if ($content -match $target) {
            Write-Output "Found in $($file.Name)"
            try {
                $json = $content | ConvertFrom-Json
                if ($json -is [array]) {
                    foreach ($item in $json) {
                        $str = $item | ConvertTo-Json -Depth 2
                        if ($str -match $target) {
                            Write-Output "  Date: $($item.date -or $item.postedTime -or $item.time)"
                            Write-Output "  Text: $($item.text -or $item.caption)"
                            Write-Output "  URL: $($item.url -or $item.postUrl)"
                        }
                    }
                }
            } catch {}
        }
    }
}
