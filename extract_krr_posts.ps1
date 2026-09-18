[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = Get-Content -Raw -Encoding UTF8 "scratch/dataset.json" | ConvertFrom-Json
$comp = $raw.companies | Where-Object { $_.id -eq "comp-udon-56" -or $_.name -like "*เกียรติรุ่งเรือง*" }

Write-Output "Found company: $($comp.name) ($($comp.id))"
Write-Output "Total posts in dataset: $($comp.posts.Count)"

$out = @()
$idx = 1
foreach ($p in $comp.posts) {
    $item = [PSCustomObject]@{
        Index = $idx
        Id = $p.id
        Time = $p.time
        Url = $p.url
        TopLevelUrl = $p.top_level_url
        Likes = $p.reaction_count
        Shares = $p.share_count
        MediaCount = $p.media_count
        Text = $p.text
    }
    $out += $item
    $idx++
}

$out | ConvertTo-Json -Depth 10 | Set-Content -Path "scratch/krr_extracted.json" -Encoding UTF8
Write-Output "Saved to scratch/krr_extracted.json"
