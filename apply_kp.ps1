[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 1. Update js/app.js
$appContent = Get-Content -Path "js\app.js" -Raw -Encoding UTF8

$kpStrategy = @"
  'comp-udon-20': {
    customDiagnostic: 'ผู้รับเหมาที่มีความเชี่ยวชาญด้าน <strong>งานรับสร้างบ้านเดี่ยว บิวท์อิน และงานต่อเติมพรีเมียมในโครงการจัดสรรชั้นนำ (ม.ศุภาลัย โนโว วิลล์, ศุภาลัย เลค แอนด์ พาร์ค)</strong> ในเขตเมืองอุดรธานี บริหารและคุมงานโดย คุณชัยธวัช (“เจ้าของดูแลเองทุกหลัง”) เริ่มเปิดบิลสั่งซื้อสินค้า SCG ในปี 2026 (฿7,101 - SCG Code 10739362) ถือเป็น New Prospect ศักยภาพสูงที่มีงานต่อเนื่องและมีฐานลูกค้ากำลังซื้อสูง',
    customRecommendations: [
      '<strong>คอนกรีตผสมเสร็จ CPAC สำหรับงานต่อเติมและบ้านในหมู่บ้านจัดสรร:</strong> นำเสนอโซลูชันคอนกรีต CPAC รถโม่เล็ก (Small Truck) และคอนกรีตกันซึม ช่วยให้เข้าออกซอยแคบในโครงการศุภาลัยได้สะดวก ไม่เลอะเทอะ และได้มาตรฐานวิศวกรรม',
      '<strong>ระบบไม้ฝาและไม้ระแนงบังตา SCG Smartwood:</strong> เจาะกลุ่มงานต่อเติมโรงจอดรถ ระแนงบังตาเพิ่มความเป็นส่วนตัว และระแนงชายคาสำหรับบ้านเดี่ยว/บ้านแฝด',
      '<strong>ปูนซีเมนต์สำเร็จรูป เสือ มอร์ตาร์ สำหรับงานครัวปูน & ก่อฉาบ:</strong> ล็อกสเปก เสือ มอร์ตาร์ ก่อ-ฉาบทั่วไป และปูนกาวซีเมนต์ สำหรับงานเคาน์เตอร์ครัวปูนรูปตัว L และงานปูกระเบื้อง',
      '<strong>กระเบื้องปูพื้นและตกแต่ง COTTO (Tile & Surface):</strong> นำเสนอชุดกระเบื้องปูพื้นโรงจอดรถกันลื่น (R10-R11) และกระเบื้องตกแต่งเคาน์เตอร์ครัว ตอบโจทย์ลูกค้าบ้านจัดสรรระดับกลาง-บน'
    ]
  },
"@

if ($appContent -notmatch "'comp-udon-20':\s*\{") {
    $appContent = $appContent -replace "('comp-udon-50':\s*\{[\s\S]*?\n\s*\}\n\s*\};)", "$kpStrategy`n  `$1"
    Set-Content -Path "js\app.js" -Value $appContent -Encoding UTF8
    Write-Output "Updated js/app.js with comp-udon-20 strategy"
} else {
    Write-Output "comp-udon-20 already exists in js/app.js"
}

# 2. Update js/data.js
$dataContent = Get-Content -Path "js\data.js" -Raw -Encoding UTF8
$cleanJson = $dataContent -replace "^\s*var\s+UDON_COMPANIES\s*=\s*", "" -replace ";\s*$", ""
$companies = $cleanJson | ConvertFrom-Json

for ($i = 0; $i -lt $companies.Count; $i++) {
    if ($companies[$i].id -eq "comp-udon-20") {
        $c = $companies[$i]
        $c.name = "ห้างหุ้นส่วนจํากัด เค พี โฮม"
        $c.engName = "K.P. Home Ltd., Part."
        $c.category = "รับสร้างบ้าน บิวท์อิน และงานต่อเติมอาคาร (TSIC 41001)"
        $c.phone = "086 053 9306"
        $c.contactPerson = "คุณชัยธวัช (086-0539306, 095-2164459)"
        $c.totalProjects = 5
        $c.newProjectsThisMonth = 5
        $c.totalValueMillion = 18.5
        $c.growthRate = 100
        $c.areaExpansion = "เมืองอุดรธานี, ม.ศุภาลัย โนโว วิลล์, ม.ศุภาลัย เลค แอนด์ พาร์ค"
        $c.tag = "focus"
        $c.opportunityScore = 88
        $c.revenuePotentialText = "฿862K"
        $c.latestTimelineStage = "structure"
        $c.stageBreakdown = [PSCustomObject]@{
            groundbreak = 1
            foundation = 1
            structure = 2
            finishing = 1
        }
        $c.verificationStatus = [PSCustomObject]@{
            isVerified = $true
            confidence = "100%"
            evidenceSource = "Facebook Page | DBD: 0415558016789"
            permitStatus = "TSIC 41001"
        }
        $c.aiShortRec = "พบ 5 ไซต์งานก่อสร้างและต่อเติมจริงใน จ.อุดรธานี (ศุภาลัย 2 ไซต์, บ้านเดี่ยว 3 ไซต์) แนะนำเสนอ CPAC รถโม่เล็กและไม้ระแนง SCG Smartwood"
        $c.aiRecommendation = "ลูกค้ารายใหม่เปิดบิล SCG (10739362) เน้นงานบ้านเดี่ยวและงานต่อเติมพรีเมียมในโครงการจัดสรรศุภาลัย แนะนำเร่งล็อกสเปก CPAC Small Truck + ไม้ระแนง SCG Smartwood และกระเบื้อง COTTO ด่วน"
        $c.customDiagnostic = "ผู้รับเหมาที่มีความเชี่ยวชาญด้าน <strong>งานรับสร้างบ้านเดี่ยว บิวท์อิน และงานต่อเติมพรีเมียมในโครงการจัดสรรชั้นนำ (ม.ศุภาลัย โนโว วิลล์, ศุภาลัย เลค แอนด์ พาร์ค)</strong> ในเขตเมืองอุดรธานี บริหารและคุมงานโดย คุณชัยธวัช (“เจ้าของดูแลเองทุกหลัง”) เริ่มเปิดบิลสั่งซื้อสินค้า SCG ในปี 2026 (฿7,101 - SCG Code 10739362) ถือเป็น New Prospect ศักยภาพสูงที่มีงานต่อเนื่องและมีฐานลูกค้ากำลังซื้อสูง"
        $c.customRecommendations = @(
            "<strong>คอนกรีตผสมเสร็จ CPAC สำหรับงานต่อเติมและบ้านในหมู่บ้านจัดสรร:</strong> นำเสนอโซลูชันคอนกรีต CPAC รถโม่เล็ก (Small Truck) และคอนกรีตกันซึม ช่วยให้เข้าออกซอยแคบในโครงการศุภาลัยได้สะดวก ไม่เลอะเทอะ และได้มาตรฐานวิศวกรรม",
            "<strong>ระบบไม้ฝาและไม้ระแนงบังตา SCG Smartwood:</strong> เจาะกลุ่มงานต่อเติมโรงจอดรถ ระแนงบังตาเพิ่มความเป็นส่วนตัว และระแนงชายคาสำหรับบ้านเดี่ยว/บ้านแฝด",
            "<strong>ปูนซีเมนต์สำเร็จรูป เสือ มอร์ตาร์ สำหรับงานครัวปูน & ก่อฉาบ:</strong> ล็อกสเปก เสือ มอร์ตาร์ ก่อ-ฉาบทั่วไป และปูนกาวซีเมนต์ สำหรับงานเคาน์เตอร์ครัวปูนรูปตัว L และงานปูกระเบื้อง",
            "<strong>กระเบื้องปูพื้นและตกแต่ง COTTO (Tile & Surface):</strong> นำเสนอชุดกระเบื้องปูพื้นโรงจอดรถกันลื่น (R10-R11) และกระเบื้องตกแต่งเคาน์เตอร์ครัว ตอบโจทย์ลูกค้าบ้านจัดสรรระดับกลาง-บน"
        )
        $c.salesActionPlan = @(
            "นัดหมายเข้าพบคุณชัยธวัช เพื่อเสนอวงเงินเครดิตคู่ค้าและเปิดรหัสสินค้า SCG / CPAC ครบวงจร",
            "เสนอโซลูชัน CPAC รถโม่เล็ก สำหรับไซต์งานต่อเติมใน ม.ศุภาลัย โนโว วิลล์ และ ม.ศุภาลัย เลค แอนด์ พาร์ค",
            "ส่งมอบแคตตาล็อกไม้ระแนง SCG Smartwood, กาวซีเมนต์ COTTO และตัวอย่างสีกระเบื้องปูพื้นโรงจอดรถ",
            "ประสานงานจัดส่งปูนซีเมนต์ไฮดรอลิก SCG และปูนเสือ มอร์ตาร์ ตรงถึงหน้างานสร้างบ้านเดี่ยวในเขตเมืองอุดรธานี"
        )
        
        $p1 = [PSCustomObject]@{
            projectId = "comp-udon-20-1"
            name = "โครงการก่อสร้างบ้านพักอาศัยเดี่ยว 2 ชั้น เมืองอุดรธานี (New Launch ก.ย. 69)"
            location = "อ.เมืองอุดรธานี จ.อุดรธานี"
            province = "อุดรธานี"
            district = "เมืองอุดรธานี"
            gps = @(17.417, 102.81)
            stage = "งานโครงสร้างเสา-คาน และก่อฉาบอาคาร"
            stageKey = "structure"
            trackingStatus = "pending"
            progressPercent = 50
            estValue = "5.5 ล้านบาท"
            buildingType = "บ้านพักอาศัยเดี่ยว 2 ชั้น"
            caption = "ขอให้เดือน กันยายน ใจดีกับเรา 🏠🏠 หลังนี้ ขอให้ได้ ขอให้ปัง ปัง 💯💯 ทีมงานเคพีโฮมรับสร้างบ้านและบิวท์อิน ยินดีให้บริการ และรอต้อนรับลูกค้าทุกท่านจ้า 🙏 ทักสอบถามมาได้เลยนะคะ ☎️ 086-0539306, 095-2164459 คุณชัยธวัช"
            postedTime = "10/9/2569"
            postUrl = "https://www.facebook.com/permalink.php?story_fbid=pfbid02AUwjeBg5P3P6WkN98hCNMkgSj5Lg5zHa3a1EFSbAsN5yw3WqQN34fUukoYY1dU2Ll&id=100066713327564"
            boq = @(
                [PSCustomObject]@{
                    sku = "คอนกรีตผสมเสร็จ CPAC 240 ksc"
                    qty = "65 คิว"
                    estCost = "฿143,000"
                    urgency = "ด่วนที่สุด"
                },
                [PSCustomObject]@{
                    sku = "ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง"
                    qty = "350 ถุง"
                    estCost = "฿59,500"
                    urgency = "ด่วนที่สุด"
                },
                [PSCustomObject]@{
                    sku = "ปูนเสือ มอร์ตาร์ ฉาบละเอียด/สำเร็จรูป"
                    qty = "250 ถุง"
                    estCost = "฿32,500"
                    urgency = "เตรียมสั่งซื้อ"
                }
            )
        }

        $p2 = [PSCustomObject]@{
            projectId = "comp-udon-20-2"
            name = "โครงการก่อสร้างฐานรากบ้านพักอาศัย ม.ศุภาลัย โนโว วิลล์ อุดรธานี"
            location = "โครงการศุภาลัย โนโว วิลล์ ถ.เลี่ยงเมือง ต.บ้านจั่น อ.เมือง จ.อุดรธานี"
            province = "อุดรธานี"
            district = "เมืองอุดรธานี"
            gps = @(17.417, 102.81)
            stage = "งานฐานราก ตอม่อ และคานคอดิน (เทคอนกรีตช่วงฤดูฝน)"
            stageKey = "foundation"
            trackingStatus = "pending"
            progressPercent = 35
            estValue = "4.2 ล้านบาท"
            buildingType = "บ้านพักอาศัยเดี่ยวในโครงการจัดสรร"
            caption = "ว่าแต่ตั้งแบบ 🌧 กะมาหาโลด ลูกรักเทวาดาจริงๆ เคพีโฮม 🙏🙏 สู้มา สู้กลับจ้า หน้างานศุภาลัยโนโววิลล์ อุดรธานี 🏠🏠 งานฐานรากโครงสร้างก็ออกจะ เลอะ เลอะ หน่อยนะคะ ต้องขออภัยในความไม่เรียบร้อยจ้า 🙏🙏 ทีมงานยังต้องการลูกค้าอีกเป็นจำนวนมาก ติดต่อสอบถาม ☎️ 086-0539306, 095-2164459 คุณชัยธวัช"
            postedTime = "29/8/2569"
            postUrl = "https://www.facebook.com/permalink.php?story_fbid=pfbid02qB6xL3MzHbDpHttyo1fdVGNoxG5NgbR7MW6A2jtUncrx1P9w58cyXXntrSMWBG5Vl&id=100066713327564"
            boq = @(
                [PSCustomObject]@{
                    sku = "คอนกรีตผสมเสร็จ CPAC เทฐานราก/กันซึม"
                    qty = "80 คิว"
                    estCost = "฿184,000"
                    urgency = "ด่วนที่สุด"
                },
                [PSCustomObject]@{
                    sku = "ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง"
                    qty = "200 ถุง"
                    estCost = "฿34,000"
                    urgency = "ด่วนที่สุด"
                },
                [PSCustomObject]@{
                    sku = "เหล็กข้ออ้อยและเหล็กเส้นกลม มอก."
                    qty = "3.5 ตัน"
                    estCost = "฿84,000"
                    urgency = "เตรียมสั่งซื้อ"
                }
            )
        }

        $p3 = [PSCustomObject]@{
            projectId = "comp-udon-20-3"
            name = "โครงการต่อเติมโรงจอดรถ ระแนงบังตา และเคาน์เตอร์ครัวปูน ม.ศุภาลัย เลค แอนด์ พาร์ค (บ้านคุณมะนาว)"
            location = "โครงการศุภาลัย เลค แอนด์ พาร์ค อ.เมือง จ.อุดรธานี"
            province = "อุดรธานี"
            district = "เมืองอุดรธานี"
            gps = @(17.417, 102.81)
            stage = "งานสถาปัตย์ ตกแต่งไม้ระแนง งานปูกระเบื้อง และก่อเคาน์เตอร์ครัวปูน"
            stageKey = "finishing"
            trackingStatus = "pending"
            progressPercent = 80
            estValue = "1.2 ล้านบาท"
            buildingType = "งานต่อเติมบ้านแฝดพรีเมียม"
            caption = "Up Date 🏠🏠🎉🎉 โครงการหมู่บ้านศุภาลัยเลคแอนด์พาร์ค อุดรธานี ( บ้านแฝด ) เจ้าของบ้าน คุณมะนาว 🤷‍♀️ #งานต่อเติมโรงจอดรถมุงหลังคาเมทัลชีท pu บลูสโคป โชว์โครง 🎀 #งานต่อเติมติดตั้งระแนงบังตาพร้อมงานปูกระเบื้อง 🎀 #งานเคาร์เตอร์ครัวปูน ตัว แอล 🎀 ติดต่อ ☎️ 086-0539306, 095-2164459 คุณชัยธวัช"
            postedTime = "18/8/2569"
            postUrl = "https://www.facebook.com/reel/1049505434347852/"
            boq = @(
                [PSCustomObject]@{
                    sku = "ไม้ระแนงบังตา & ไม้สังเคราะห์ SCG Smartwood"
                    qty = "120 แผ่น"
                    estCost = "฿24,000"
                    urgency = "ด่วนที่สุด"
                },
                [PSCustomObject]@{
                    sku = "ปูนเสือ มอร์ตาร์ ก่อ-ฉาบ ครัวปูน & งานทั่วไป"
                    qty = "60 ถุง"
                    estCost = "฿7,800"
                    urgency = "ด่วนที่สุด"
                },
                [PSCustomObject]@{
                    sku = "กระเบื้องปูพื้นโรงจอดและท็อปเคาน์เตอร์ COTTO"
                    qty = "85 ตร.ม."
                    estCost = "฿42,500"
                    urgency = "เตรียมสั่งซื้อ"
                },
                [PSCustomObject]@{
                    sku = "กาวซีเมนต์และกาวยาแนว COTTO / SCG"
                    qty = "25 ถุง"
                    estCost = "฿6,250"
                    urgency = "เตรียมสั่งซื้อ"
                }
            )
        }

        $p4 = [PSCustomObject]@{
            projectId = "comp-udon-20-4"
            name = "โครงการเปิดหน้างานสร้างบ้านพักอาศัยเดี่ยว Zone เมืองอุดรธานี"
            location = "อ.เมือง จ.อุดรธานี"
            province = "อุดรธานี"
            district = "เมืองอุดรธานี"
            gps = @(17.417, 102.81)
            stage = "งานเปิดหน้าดิน ปรับผัง และงานโครงสร้างคานคอดิน"
            stageKey = "groundbreak"
            trackingStatus = "pending"
            progressPercent = 20
            estValue = "4.8 ล้านบาท"
            buildingType = "บ้านพักอาศัยเดี่ยว 2 ชั้น"
            caption = "วันนี้ท้องฟ้าเป็นใจ เข้าหน้างานใหม่อีกหลัง 🏠 ขอให้วันนี้ทำงานโดยไม่มีอุปสรรค์ และผ่านพ้นไปได้ด้วยดี ทุกอย่าง 💯 ถึงหน้างานเราจะไม่ได้ใหญ่โต มากมาย แต่ทุกครั้งที่เราได้รับความเชื่อใจ จากเจ้าของบ้าน ทีมงานก็ทำทุกอย่าง อย่างเต็มที่ 📌 086-0539306, 095-2164459 คุณชัยธวัช เจ้าของดูแลเองทุกหลัง 😊"
            postedTime = "24/8/2569"
            postUrl = "https://www.facebook.com/reel/28583981357863240/"
            boq = @(
                [PSCustomObject]@{
                    sku = "คอนกรีตผสมเสร็จ CPAC 240 ksc"
                    qty = "55 คิว"
                    estCost = "฿121,000"
                    urgency = "ด่วนที่สุด"
                },
                [PSCustomObject]@{
                    sku = "ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง"
                    qty = "300 ถุง"
                    estCost = "฿51,000"
                    urgency = "ด่วนที่สุด"
                }
            )
        }

        $p5 = [PSCustomObject]@{
            projectId = "comp-udon-20-5"
            name = "โครงการปรับปรุงต่อเติม & ติดตั้งประตูเหล็กดัดบ้านพักอาศัย อ.เมืองอุดรธานี"
            location = "ต.หมากแข้ง อ.เมือง จ.อุดรธานี"
            province = "อุดรธานี"
            district = "เมืองอุดรธานี"
            gps = @(17.417, 102.81)
            stage = "งานต่อเติมสถาปัตย์ ติดตั้งเหล็กดัดสั่งทำพิเศษ และงานปรับระดับพื้น"
            stageKey = "structure"
            trackingStatus = "pending"
            progressPercent = 70
            estValue = "2.8 ล้านบาท"
            buildingType = "บ้านพักอาศัยเดี่ยว"
            caption = "😊😊 งานเล็ก งานใหญ่ เราทำได้ ขอเพียงลูกค้าติดต่อเรา 😊😊 วันนี้เข้าติดตั้งประตูเหล็กดัด (สั่งทำพิเศษ) สำหรับลูกค้าคนพิเศษ 💯 ทางทีมงานเคพีโฮม ยินดีให้บริการ ติดต่อ ☎️ 086-0539306, 095-2164459 คุณชัยธวัช"
            postedTime = "3/9/2569"
            postUrl = "https://www.facebook.com/permalink.php?story_fbid=pfbid0e2udk5VgZJAxLSxiVELpM8NZu2Tn5KMHmrbzDhk3Qxoc4eBnKPEiSoT8qXoEH5kXl&id=100066713327564"
            boq = @(
                [PSCustomObject]@{
                    sku = "ปูนปรับระดับ Self-Leveling / ซ่อมโครงสร้าง SCG"
                    qty = "30 ถุง"
                    estCost = "฿6,900"
                    urgency = "ด่วนที่สุด"
                },
                [PSCustomObject]@{
                    sku = "สีทาภายนอก/ภายใน & เคมีภัณฑ์กันซึม SCG / COTTO"
                    qty = "15 ถัง"
                    estCost = "฿28,500"
                    urgency = "เตรียมสั่งซื้อ"
                }
            )
        }

        $c.projects = @($p1, $p2, $p3, $p4, $p5)
        Write-Output "Successfully updated comp-udon-20 in UDON_COMPANIES array"
        break
    }
}

$newJson = $companies | ConvertTo-Json -Depth 12
$finalJsContent = "var UDON_COMPANIES = " + $newJson + ";"
Set-Content -Path "js\data.js" -Value $finalJsContent -Encoding UTF8
Write-Output "Saved js/data.js with UTF-8 encoding successfully"
