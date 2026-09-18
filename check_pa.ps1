if (Test-Path 'scratch/pa_posts.json') {
    $raw = Get-Content 'scratch/pa_posts.json' -Raw -Encoding UTF8 | ConvertFrom-Json
    Write-Output "Found $($raw.Count) posts in scratch/pa_posts.json"
} else {
    Write-Output "pa_posts.json not found"
}
