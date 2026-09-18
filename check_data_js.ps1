# Let's inspect data.js array syntax and company objects count
$content = Get-Content 'js/data.js' -Raw -Encoding UTF8
Write-Output "Length of data.js: $($content.Length)"
