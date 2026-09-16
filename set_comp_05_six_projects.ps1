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
        $comp.totalProjects = 6
        $comp.newProjectsThisMonth = 6
        $comp.totalValueMillion = 33
        $comp.areaExpansion = 'เมืองอุดรธานี, หนองวัวซอ'
        $comp.stageBreakdown = [PSCustomObject]@{
            groundbreak = 0
            foundation = 1
            structure = 2
            finishing = 3
        }
        $comp.latestTimelineStage = 'foundation'
        $comp.facebookSignal = [PSCustomObject]@{
            postDate = '03/09/2026'
            pageName = 'บริษัท มหารุ่งโรจน์โฮมบิลเดอร์ จำกัด'
            caption = 'เบื้องหลัง "พื้นดินเรียบสวย" คือความใส่ใจระดับมิลลิเมตรจากทีมงานเรา 🚜✨'
            likes = 0
            comments = 0
            shares = 0
            detectedKeywords = @('อุดรธานี', 'หนองวัวซอ', 'SCG')
        }
        $comp.projects = @(
            [PSCustomObject]@{
                projectId = 'comp-udon-05-1'
                name = 'เบื้องหลังพื้นดินเรียบสวย (งานปรับระดับดิน/สำรวจหน้างาน)'
                stage = 'งานฐานราก ตอม่อ และคานคอดิน'
                stageKey = 'foundation'
                progressPercent = 35
                location = 'อ.เมืองอุดรธานี จ.อุดรธานี'
                province = 'อุดรธานี'
                district = 'เมืองอุดรธานี'
                postedTime = '03/09/2026'
                estValue = '5.5 ล้านบาท'
                gps = @(17.408, 102.798)
                postUrl = 'https://www.facebook.com/maharungroj/posts/pfbid0ZBoQyBAh6UoMe8ErFEK6g4NdA5KDCxhNX5Pyt8DSGtcGWM42UPEwxLGij9HCs3vul'
                buildingType = 'บ้านพักอาศัยเดี่ยว 2 ชั้น'
                trackingStatus = 'pending'
                caption = 'เบื้องหลัง "พื้นดินเรียบสวย" คือความใส่ใจระดับมิลลิเมตรจากทีมงานเรา 🚜✨'
                boq = @(
                    [PSCustomObject]@{ sku = 'ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง'; qty = '450 ถุง'; estCost = '฿76,500'; urgency = 'ด่วนที่สุด' },
                    [PSCustomObject]@{ sku = 'คอนกรีตผสมเสร็จ CPAC 240 ksc'; qty = '75 คิว'; estCost = '฿165,000'; urgency = 'เตรียมสั่งซื้อ' }
                )
            },
            [PSCustomObject]@{
                projectId = 'comp-udon-05-2'
                name = 'สำรวจหน้างานจริง 3 หลัง (อุดรธานี)'
                stage = 'งานโครงสร้างและก่อฉาบอาคาร'
                stageKey = 'structure'
                progressPercent = 50
                location = 'อ.เมืองอุดรธานี จ.อุดรธานี'
                province = 'อุดรธานี'
                district = 'เมืองอุดรธานี'
                postedTime = '02/09/2026'
                estValue = '5.5 ล้านบาท'
                gps = @(17.408, 102.798)
                postUrl = 'https://www.facebook.com/maharungroj/posts/pfbid0A7sJEHujdzE7mUwabe4NJk7H4jZ1VfwUXfkBBnfywbvn7wzW21xJZpKepFkQfThJl'
                buildingType = 'บ้านพักอาศัยเดี่ยว 2 ชั้น'
                trackingStatus = 'pending'
                caption = 'วันเดียวจัดไป 3 หลังจุกๆ! ทีมงาน MRB ลงพื้นที่สำรวจหน้างานจริง 🏗️📐'
                boq = @(
                    [PSCustomObject]@{ sku = 'ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง'; qty = '450 ถุง'; estCost = '฿76,500'; urgency = 'ด่วนที่สุด' },
                    [PSCustomObject]@{ sku = 'คอนกรีตผสมเสร็จ CPAC 240 ksc'; qty = '75 คิว'; estCost = '฿165,000'; urgency = 'เตรียมสั่งซื้อ' }
                )
            },
            [PSCustomObject]@{
                projectId = 'comp-udon-05-3'
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
                    [PSCustomObject]@{ sku = 'ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง'; qty = '450 ถุง'; estCost = '฿76,500'; urgency = 'ด่วนที่สุด' },
                    [PSCustomObject]@{ sku = 'คอนกรีตผสมเสร็จ CPAC 240 ksc'; qty = '75 คิว'; estCost = '฿165,000'; urgency = 'เตรียมสั่งซื้อ' }
                )
            },
            [PSCustomObject]@{
                projectId = 'comp-udon-05-4'
                name = 'บ้านคุณออย & คุณต้า (งานสถาปัตย์/ส่งมอบ)'
                stage = 'งานสถาปัตย์ ตกแต่ง และเตรียมส่งมอบ'
                stageKey = 'finishing'
                progressPercent = 85
                location = 'อ.เมืองอุดรธานี จ.อุดรธานี'
                province = 'อุดรธานี'
                district = 'เมืองอุดรธานี'
                postedTime = '26/08/2026'
                estValue = '5.5 ล้านบาท'
                gps = @(17.408, 102.798)
                postUrl = 'https://www.facebook.com/maharungroj/posts/pfbid02HvKo9xWxHNm4qy1fPJvjPSqtLy1gQKuCpqxiHXDSgbJSJKFfUFjrhhBPrRtzJ7qQl'
                buildingType = 'บ้านพักอาศัยเดี่ยว 2 ชั้น'
                trackingStatus = 'pending'
                caption = 'ไม่มีอะไรยืนยันมาตรฐานและความประทับใจได้ดีไปกว่า การบอกต่อ ปากต่อปากจากลูกค้าที่สร้างจริง'
                boq = @(
                    [PSCustomObject]@{ sku = 'ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง'; qty = '450 ถุง'; estCost = '฿76,500'; urgency = 'ด่วนที่สุด' },
                    [PSCustomObject]@{ sku = 'คอนกรีตผสมเสร็จ CPAC 240 ksc'; qty = '75 คิว'; estCost = '฿165,000'; urgency = 'เตรียมสั่งซื้อ' }
                )
            },
            [PSCustomObject]@{
                projectId = 'comp-udon-05-5'
                name = 'บ้านคุณกวาง (งานทาสีรองพื้นและเตรียมเทปรับระดับ)'
                stage = 'งานสถาปัตย์ ตกแต่ง และเตรียมส่งมอบ'
                stageKey = 'finishing'
                progressPercent = 85
                location = 'อ.หนองวัวซอ จ.อุดรธานี'
                province = 'อุดรธานี'
                district = 'หนองวัวซอ'
                postedTime = '22/08/2026'
                estValue = '5.5 ล้านบาท'
                gps = @(17.165, 102.571)
                postUrl = 'https://www.facebook.com/maharungroj/posts/pfbid02idNxt8WWWVaSzUtQKMVjub6hjS4nXiRMe81q7jfCQ9HjtqrNAqTECdFqnYEfzVqHl'
                buildingType = 'บ้านพักอาศัยเดี่ยว 2 ชั้น'
                trackingStatus = 'pending'
                caption = '🏡 อัปเดตความคืบหน้าหน้างาน บ้านคุณกวาง'
                boq = @(
                    [PSCustomObject]@{ sku = 'ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง'; qty = '450 ถุง'; estCost = '฿76,500'; urgency = 'ด่วนที่สุด' },
                    [PSCustomObject]@{ sku = 'คอนกรีตผสมเสร็จ CPAC 240 ksc'; qty = '75 คิว'; estCost = '฿165,000'; urgency = 'เตรียมสั่งซื้อ' }
                )
            },
            [PSCustomObject]@{
                projectId = 'comp-udon-05-6'
                name = 'จากภาพ 3D สู่งานจริง (งานโครงสร้างและก่อฉาบ)'
                stage = 'งานโครงสร้างและก่อฉาบอาคาร'
                stageKey = 'structure'
                progressPercent = 50
                location = 'อ.เมืองอุดรธานี จ.อุดรธานี'
                province = 'อุดรธานี'
                district = 'เมืองอุดรธานี'
                postedTime = '18/08/2026'
                estValue = '5.5 ล้านบาท'
                gps = @(17.408, 102.798)
                postUrl = 'https://www.facebook.com/maharungroj/posts/pfbid0vtmuwXkbLaVy73YdcWsxYwAwNq4WuQTEzApftrvTbTm8Jk9nu2VNZyjBwU5YK3vRl'
                buildingType = 'บ้านพักอาศัยเดี่ยว 2 ชั้น'
                trackingStatus = 'pending'
                caption = 'จากภาพ 3D สู่งานจริง... ปรับเปลี่ยนได้ตามใจคุณ'
                boq = @(
                    [PSCustomObject]@{ sku = 'ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง'; qty = '450 ถุง'; estCost = '฿76,500'; urgency = 'ด่วนที่สุด' },
                    [PSCustomObject]@{ sku = 'คอนกรีตผสมเสร็จ CPAC 240 ksc'; qty = '75 คิว'; estCost = '฿165,000'; urgency = 'เตรียมสั่งซื้อ' }
                )
            }
        )
        $comp.aiShortRec = 'พบ 6 ไซต์งานก่อสร้างจริงใน จ.อุดรธานี (ฐานราก: 1, โครงสร้าง: 2, สถาปัตย์/ตกแต่ง: 3)'
        $comp.aiRecommendation = 'มีไซต์งานก่อสร้างจริงตรวจพบจาก Facebook 6 รายการใน จ.อุดรธานี แนะนำเข้าล็อกสเปกปูน SCG และคอนกรีต CPAC'
    }
    
    $newJson = $data | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($fp, ($prefix + $newJson + $suffix), [System.Text.Encoding]::UTF8)
    Write-Output "Updated $fp - count: $($comp.projects.Count)"
}
