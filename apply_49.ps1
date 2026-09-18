$content = Get-Content -Encoding UTF8 -Path "js/data.js" -Raw
$jsonStr = $content -replace '^\s*var\s+UDON_COMPANIES\s*=\s*', '' -replace ';\s*$', ''
$data = $jsonStr | ConvertFrom-Json

$updated = $false
foreach ($c in $data) {
    if ($c.id -eq "comp-udon-49") {
        $c.tag = "focus"
        $c.opportunityScore = 85
        $c.phone = "092 412 3987 / 062 162 7265"
        $c.contactPerson = "คุณนิติพันธ์ (092-412-3987), คุณริน (062-162-7265), คุณแบงค์ (098-851-9935)"
        $c.district = "เมืองอุดรธานี"
        $c.address = "702 หมู่ 2 ต.สามพร้าว อ.เมือง จ.อุดรธานี 41000"
        $c.totalProjects = 2
        $c.newProjectsThisMonth = 2
        $c.totalValueMillion = 9.0
        $c.latestTimelineStage = "finishing"
        $c.revenuePotentialText = "฿2.5M"
        $c.stageBreakdown = [PSCustomObject]@{
            groundbreak = 1
            foundation = 0
            structure = 0
            finishing = 1
        }
        $c.aiShortRec = "พบ 2 ไซต์สร้างบ้าน Active จริงใน อ.เมืองอุดรธานี (บ้านดอนหาด ขั้นตอนฉาบ/กระเบื้อง, และไซต์ใหม่พิธียกเสาเอก-เสาโท) ยอดซื้อ SCG ฿569.8K (+2.89% YoY)"
        $c.aiRecommendation = "ผู้บริหารคุมหน้างานตรง แนะนำเร่งล็อกสเปกคอนกรีตผสมเสร็จ CPAC 65 คิว สำหรับไซต์ใหม่เมืองอุดรฯ และเสนอโซลูชันกระเบื้อง COTTO + ปูนฉาบเสือมอร์ตาร์ สำหรับไซต์บ้านดอนหาดด่วน"
        $c.customDiagnostic = "บริษัทรับสร้างบ้านเดี่ยวคุณภาพมาตรฐานใน จ.อุดรธานี (นิติพันธ์สร้างบ้านอุดรธานี) มียอดสั่งซื้อ SCG สม่ำเสมอ <strong>฿569,818</strong> (+2.89% YoY, SCG Code 10383888) มีการบริหารงานแบบเจ้าของคุมงานใกล้ชิด (คุณนิติพันธ์ และคุณแบงค์) ตรวจพบไซต์งานจริง 2 โครงการ ได้แก่ ไซต์บ้านดอนหาด (งานฉาบและปูกระเบื้อง) และไซต์ใหม่โซนเมืองอุดรฯ (เพิ่งทำพิธียกเสาเอก-เสาโท) มีโอกาสสูงในการขยายยอดซื้อคอนกรีต CPAC, ปูนฉาบเสือมอร์ตาร์ และกระเบื้อง-สุขภัณฑ์ COTTO"
        $c.customRecommendations = @(
            "<strong>คอนกรีตผสมเสร็จ CPAC 240 ksc (แพ็กเกจ 65 คิว):</strong> ล็อกสเปกส่งตรงหน้างานไซต์ใหม่โซนเมืองอุดรธานี สำหรับงานเทคานคอดิน เสา และพื้นโครงสร้าง",
            "<strong>ปูนฉาบสำเร็จรูป เสือ มอร์ตาร์ ฉาบละเอียด (350 ถุง):</strong> นำเสนอโปรโมชั่นส่งตรงถึงไซต์บ้านดอนหาด เพื่อรองรับงานฉาบผิวเรียบเนียนมาตรฐาน",
            "<strong>กระเบื้องเซรามิก COTTO 280 ตร.ม. & ชุดสุขภัณฑ์ COTTO 3 ชุด:</strong> จัดทำ Mood Board กระเบื้องปูพื้น 60x60 ซม. ลายยอดนิยมให้คุณรินนำเสนอเจ้าของบ้าน",
            "<strong>ชุดฝ้าเพดานยิปซัมตราช้าง SCG 9 มม. & ฉนวนกันความร้อน STAY COOL:</strong> เข้าล็อกสเปกมาตรฐานสำหรับแพ็กเกจของแถมฝ้าหลุมและบ้านประหยัดพลังงาน"
        )
        $c.salesActionPlan = @(
            "ติดต่อคุณแบงค์ (098-851-9935) เพื่อเสนอราคาและจองคิวรถคอนกรีตผสมเสร็จ CPAC 240 ksc เทคาน-เสาไซต์ใหม่เมืองอุดรธานี",
            "จัดส่งแคตตาล็อกกระเบื้องและสุขภัณฑ์ COTTO พร้อมใบเสนอราคาโครงการให้คุณริน (062-162-7265) สำหรับไซต์บ้านดอนหาด",
            "เสนอแพ็กเกจบันเดิลปูนฉาบ เสือ มอร์ตาร์ คู่กับแผ่นยิปซัมตราช้าง SCG และฉนวน STAY COOL ให้คุณนิติพันธ์ (092-412-3987)",
            "จัดระบบเครดิตเทอมและการจัดส่งตรงหน้างานด่วนผ่านศูนย์กระจายสินค้า SCG อุดรธานี"
        )

        $c.projects = @(
            [PSCustomObject]@{
                projectId = "comp-udon-49-1"
                name = "โครงการบ้านพักอาศัยเดี่ยว 2 ชั้น สไตล์โมเดิร์น บ้านดอนหาด"
                location = "บ้านดอนหาด ต.บ้านจั่น อ.เมือง จ.อุดรธานี"
                province = "อุดรธานี"
                district = "เมืองอุดรธานี"
                gps = @(17.4105, 102.8120)
                stage = "งานฉาบผนัง งานระบบ และเตรียมปูกระเบื้องพื้น-ผนัง"
                stageKey = "finishing"
                trackingStatus = "pending"
                progressPercent = 65
                estValue = "4.0 ล้านบาท"
                buildingType = "บ้านพักอาศัยเดี่ยว 2 ชั้น สไตล์ Modern"
                caption = "อัพเดทงาน : งานฉาบและงานปูกระเบื้อง สถานที่ : บ้านดอนหาด อ.เมืองอุดรธานี โดยทีมงานนิติพันธ์สร้างบ้านอุดรธานี โทร: 092-4123987, 098-8519935"
                postedTime = "28/8/2569"
                postUrl = "https://www.facebook.com/permalink.php?story_fbid=pfbid0sGYdUdXY4t3dKK7x8jiQbadMafY4pZXULba2pxzRiVovCvdFJMdL99dvxJszKii8l&id=61555396955045"
                boq = @(
                    [PSCustomObject]@{
                        sku = "ปูนฉาบสำเร็จรูป เสือ มอร์ตาร์ ฉาบละเอียด"
                        qty = "350 ถุง"
                        estCost = "฿59,500"
                        urgency = "ด่วนที่สุด"
                    },
                    [PSCustomObject]@{
                        sku = "กระเบื้องปูพื้นและบุผนัง COTTO 60x60 ซม."
                        qty = "280 ตร.ม."
                        estCost = "฿98,000"
                        urgency = "เตรียมสั่งซื้อ"
                    },
                    [PSCustomObject]@{
                        sku = "ชุดสุขภัณฑ์และก๊อกน้ำ COTTO Standard Collection"
                        qty = "3 ชุด"
                        estCost = "฿36,000"
                        urgency = "เตรียมสั่งซื้อ"
                    },
                    [PSCustomObject]@{
                        sku = "แผ่นยิปซัมตราช้าง SCG 9 มม. พร้อมโครงคร่าวโลหะ"
                        qty = "120 แผ่น"
                        estCost = "฿28,800"
                        urgency = "เตรียมสั่งซื้อ"
                    }
                )
            },
            [PSCustomObject]@{
                projectId = "comp-udon-49-2"
                name = "โครงการก่อสร้างบ้านพักอาศัยเดี่ยวหลังใหม่ โซนเมืองอุดรธานี"
                location = "ต.สามพร้าว อ.เมือง จ.อุดรธานี"
                province = "อุดรธานี"
                district = "เมืองอุดรธานี"
                gps = @(17.4270, 102.5710)
                stage = "พิธียกเสาเอก-เสาโท งานฐานรากและโครงสร้างคานคอดิน"
                stageKey = "groundbreak"
                trackingStatus = "pending"
                progressPercent = 20
                estValue = "5.0 ล้านบาท"
                buildingType = "บ้านพักอาศัยเดี่ยว 2 ชั้น สไตล์ Modern Contemporary"
                caption = "“พิธียกเสาเอก–เสาโทผ่านไปด้วยดี ขอให้บ้านหลังนี้เป็นจุดเริ่มต้นของความสำเร็จครั้งใหม่ มั่นคง แข็งแรง และมั่งคั่งตลอดไป“ นิติพันธ์สร้างบ้านอุดรธานี โทร: 092-4123987, 062-1627265"
                postedTime = "25/8/2569"
                postUrl = "https://www.facebook.com/permalink.php?story_fbid=pfbid02wdUYanbQjiZz1zV7uzu5PB83VX3DJZaDaTt9XQbrPEQSf7u6W4AEiAhdxVo93WgKl&id=61555396955045"
                boq = @(
                    [PSCustomObject]@{
                        sku = "คอนกรีตผสมเสร็จ CPAC 240 ksc งานคาน-เสา-พื้น"
                        qty = "65 คิว"
                        estCost = "฿143,000"
                        urgency = "ด่วนที่สุด"
                    },
                    [PSCustomObject]@{
                        sku = "ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง"
                        qty = "300 ถุง"
                        estCost = "฿51,000"
                        urgency = "ด่วนที่สุด"
                    },
                    [PSCustomObject]@{
                        sku = "แผ่นพื้นคอนกรีตสำเร็จรูป CPAC Smart Slab"
                        qty = "180 ตร.ม."
                        estCost = "฿45,000"
                        urgency = "เตรียมสั่งซื้อ"
                    },
                    [PSCustomObject]@{
                        sku = "ฉนวนกันความร้อน SCG STAY COOL หนา 75 มม."
                        qty = "35 ม้วน"
                        estCost = "฿19,250"
                        urgency = "เตรียมสั่งซื้อ"
                    }
                )
            }
        )
        $updated = $true
        Write-Output "Updated comp-udon-49 successfully"
    }
}

if ($updated) {
    $outJson = $data | ConvertTo-Json -Depth 20
    $finalContent = "var UDON_COMPANIES = " + $outJson + ";"
    [System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\data.js", $finalContent, [System.Text.Encoding]::UTF8)
    Write-Output "Wrote to js/data.js successfully"
} else {
    Write-Error "comp-udon-49 not found"
}
