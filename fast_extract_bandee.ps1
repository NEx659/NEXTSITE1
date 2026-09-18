Add-Type -AssemblyName System.Web.Extensions
$serializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$serializer.MaxJsonLength = [int]::MaxValue

$jsonPath = 'c:\Users\pannipan\Downloads\N\scratch\dataset.json'
$text = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$posts = $serializer.DeserializeObject($text)

$bandeePosts = @()
foreach ($p in $posts) {
    $page = [string]$p["page_name"]
    $ptext = [string]$p["post_text"]
    if ($page -like "*Bandee*" -or $page -like "*บ้านดี อยู่ดี*" -or $ptext -like "*081-556-9261*" -or $ptext -like "*0815569261*" -or $ptext -like "*nut9722*" -or $ptext -like "*บ้านดี อยู่ดี ดีไซน์*") {
        $bandeePosts += $p
    }
}

Write-Output "Total Bandee posts found: $($bandeePosts.Count)"

$i = 1
foreach ($p in $bandeePosts) {
    Write-Output "========================================="
    Write-Output "Post #$i | ID: $($p['post_id']) | Date: $($p['post_date'])"
    Write-Output "URL: $($p['post_url'])"
    Write-Output "Page: $($p['page_name'])"
    Write-Output "Images: $($p['images'].Count)"
    Write-Output "Text: $($p['post_text'])"
    $i++
}
