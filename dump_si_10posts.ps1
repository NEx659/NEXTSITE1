$raw = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/dataset.json", [System.Text.Encoding]::UTF8)
$data = $raw | ConvertFrom-Json

$matches = @($data | Where-Object { 
    $fb = "$($_.facebookUrl) $($_.inputUrl) $($_.url) $($_.pageName) $($_.user)"
    $fb -match "siarchitecture" -or $fb -match "เอสไอ"
})

Write-Host "Total matches: $($matches.Count)"

$sb = New-Object System.Text.StringBuilder
$i = 1
foreach ($m in $matches) {
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("โพสต์ที่ $i")
    [void]$sb.AppendLine("วันที่: $($m.postDate) $($m.date) $($m.postedTime)")
    [void]$sb.AppendLine("URL: $($m.postUrl) $($m.url)")
    [void]$sb.AppendLine("Page: $($m.pageName)")
    [void]$sb.AppendLine("Likes: $($m.likes)")
    [void]$sb.AppendLine("Caption / ข้อความ:")
    [void]$sb.AppendLine("$($m.caption)$($m.text)$($m.postText)")
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("")
    $i++
}

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/scratch/si_10posts.txt", $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "Wrote to c:/Users/pannipan/Downloads/N/scratch/si_10posts.txt"
