$filePaths = @(
    "c:\Users\pannipan\Downloads\N\js\data.js",
    "c:\Users\pannipan\Downloads\N\js\baseline_1_data.js"
)

foreach ($fp in $filePaths) {
    if (-not (Test-Path $fp)) { continue }
    $raw = [System.IO.File]::ReadAllText($fp, [System.Text.Encoding]::UTF8)
    $firstBracket = $raw.IndexOf('[')
    $lastBracket = $raw.LastIndexOf(']')
    $prefix = $raw.Substring(0, $firstBracket)
    $jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
    $suffix = $raw.Substring($lastBracket + 1)
    
    $data = $jsonStr | ConvertFrom-Json
    $comp = $data | Where-Object { $_.id -eq 'comp-udon-05' }
    if ($comp) {
        $comp.totalProjects = 1
        $comp.newProjectsThisMonth = 1
        $comp.totalValueMillion = 5.5
        $comp.areaExpansion = 'หนองวัวซอ อุดรธานี'
        $comp.stageBreakdown = [PSCustomObject]@{
            groundbreak = 0
            foundation = 0
            structure = 0
            finishing = 1
        }
        $comp.latestTimelineStage = 'finishing'
        $comp.facebookSignal = [PSCustomObject]@{
            postDate = '31/08/2026'
            pageName = 'บริษัท มหารุ่งโรจน์โฮมบิลเดอร์ จำกัด'
            caption = '🏡 เบื้องหลังความเนียน: พาชมหน้างานบ้านคุณกวาง อ.หนองวัวซอ'
            likes = 0
            comments = 0
            shares = 0
            detectedKeywords = @('หนองวัวซอ', 'อุดรธานี', 'SCG')
        }
        $comp.projects = @(
            [PSCustomObject]@{
                projectId = 'comp-udon-05-1'
                name = 'บ้านคุณกวาง อ.หนองวัวซอ (งานเตรียมพื้นผิวและงานสถาปัตย์)'
                stage = 'งานสถาปัตย์ ตกแต่ง และเตรียมส่งมอบ'
                stageKey = 'finishing'
                progressPercent = 85
                location = 'อ.หนองวัวซอ จ.อุดรธานี'
                province = 'อุดรธานี'
                district = 'หนองวัวซอ'
                postedTime = '31/08/2026'
                estValue = '5.5 ล้านบาท'
                gps = @(17.165, 102.571)
                postUrl = 'https://www.facebook.com/reel/2006977646640737/'
                buildingType = 'บ้านพักอาศัยเดี่ยว 2 ชั้น'
                trackingStatus = 'pending'
                caption = '🏡 เบื้องหลังความเนียน: พาชมหน้างานบ้านคุณกวาง อ.หนองวัวซอ'
                boq = @(
                    [PSCustomObject]@{
                        sku = 'ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง'
                        qty = '450 ถุง'
                        estCost = '฿76,500'
                        urgency = 'ด่วนที่สุด'
                    },
                    [PSCustomObject]@{
                        sku = 'คอนกรีตผสมเสร็จ CPAC 240 ksc'
                        qty = '75 คิว'
                        estCost = '฿165,000'
                        urgency = 'เตรียมสั่งซื้อ'
                    }
                )
            }
        )
        $comp.aiShortRec = 'พบ 1 ไซต์งานก่อสร้างจริงใน จ.อุดรธานี (อ.หนองวัวซอ - งานสถาปัตย์ ตกแต่ง)'
        $comp.aiRecommendation = 'ตรวจพบไซต์งานจริงบ้านคุณกวาง อ.หนองวัวซอ อยู่ระหว่างเตรียมพื้นผิวและงานสถาปัตย์ แนะนำเสนอสินค้าตกแต่ง กระเบื้อง ปูนกาว และสุขภัณฑ์ SCG/COTTO'
    }
    
    $newJson = $data | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($fp, ($prefix + $newJson + $suffix), [System.Text.Encoding]::UTF8)
    Write-Output "Updated $fp - projects count: $($comp.projects.Count)"
}
