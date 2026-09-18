$raw = [System.IO.File]::ReadAllText("c:/Users/pannipan/Downloads/N/scratch/dataset.json", [System.Text.Encoding]::UTF8)
$data = $raw | ConvertFrom-Json

$matches = @($data | Where-Object { 
    $fb = "$($_.facebookUrl) $($_.inputUrl) $($_.url) $($_.pageName) $($_.user.name)"
    $fb -match "siarchitecture" -or $fb -match "เอสไอ"
})

Write-Host "Total matches: $($matches.Count)"

$sb = New-Object System.Text.StringBuilder
$i = 1
foreach ($m in $matches) {
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("โพสต์ที่ $i")
    [void]$sb.AppendLine("วันที่ / เวลา: $($m.time)")
    [void]$sb.AppendLine("URL: $($m.url)")
    [void]$sb.AppendLine("Page: $($m.pageName) | User: $($m.user.name)")
    [void]$sb.AppendLine("Likes: $($m.likes) | Comments: $($m.comments) | Shares: $($m.shares)")
    [void]$sb.AppendLine("ข้อความ (Post Text):")
    [void]$sb.AppendLine("$($m.text)")
    [void]$sb.AppendLine("==================================================")
    [void]$sb.AppendLine("")
    $i++
}

[System.IO.File]::WriteAllText("c:/Users/pannipan/Downloads/N/scratch/si_10posts_clean.txt", $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "Successfully wrote c:/Users/pannipan/Downloads/N/scratch/si_10posts_clean.txt"
