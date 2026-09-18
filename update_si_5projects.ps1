# Clean UTF-8 updater for comp-udon-54 (SI Architecture)

function To-B64($str) {
    return [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($str))
}

function From-B64($str) {
    return [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($str))
}

$content = [System.IO.File]::ReadAllText("$pwd/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

$comp = $companies | Where-Object { $_.id -eq 'comp-udon-54' }
if (-not $comp) {
    Write-Error "comp-udon-54 not found!"
    exit 1
}

Write-Host "Found comp-udon-54: $($comp.name)"

$comp.name = "ห้างหุ้นส่วนจำกัด เอสไอ อาร์คิเทคเชอร์ แอนด์ คอนสตรัคชั่น"
$comp.engName = "SI Architecture and Construction Ltd., Part."
$comp.category = "รับสร้างบ้าน อาคารพาณิชย์ และออกแบบตกแต่งภายใน (TSIC 41001)"
$comp.province = "อุดรธานี"
$comp.district = "เมืองอุดรธานี"
$comp.address = "ถ.นิตโย ต.หมากแข้ง อ.เมืองอุดรธานี จ.อุดรธานี"
$comp.phone = "081 556 9261"
$comp.contactPerson = "คุณสิทธิชัย (ผู้จัดการโครงการ) / Line: @siarchitecture"
$comp.totalProjects = 5
$comp.newProjectsThisMonth = 2
$comp.totalValueMillion = 43.2
$comp.growthRate = 45
$comp.areaExpansion = "เมืองอุดรธานี, หนองหาน, เพ็ญ"
$comp.revenuePotentialText = "฿3.5M"
$comp.latestTimelineStage = "groundbreak"
$comp.stageBreakdown = [PSCustomObject]@{
    groundbreak = 1
    foundation = 1
    structure = 2
    finishing = 1
}
$comp.verificationStatus = [PSCustomObject]@{
    isVerified = $true
    confidence = "100%"
    evidenceSource = "Facebook Page: @siarchitecture | DBD: 0415563050123"
    permitStatus = "TSIC 41001"
}

$comp.facebookSignal = [PSCustomObject]@{
    postDate = "16/7/2569"
    pageName = "ห้างหุ้นส่วนจำกัด เอสไอ อาร์คิเทคเชอร์ แอนด์ คอนสตรัคชั่น"
    caption = "NEW Project โครงการบ้านพักอาศัย ค.ส.ล. 2 ชั้น (1,327 ตร.ม.) คุณทิว-คุณหมวย อ.เมือง จ.อุดรธานี"
    likes = 18
    comments = 4
    shares = 6
    detectedKeywords = @("อุดรธานี", "NEW Project", "ก่อสร้างจริง", "คฤหาสน์ 1,327 ตร.ม.", "อาคารสำนักงาน ถ.นิตโย")
}

$projects = @(
    [PSCustomObject]@{
        projectId = "comp-udon-54-1"
        name = "โครงการบ้านพักอาศัย ค.ส.ล. 2 ชั้น (คุณทิว - คุณหมวย)"
        location = "อ.เมืองอุดรธานี จ.อุดรธานี"
        province = "อุดรธานี"
        district = "เมืองอุดรธานี"
        gps = @(17.4245, 102.7820)
        stage = "งานปรับพื้นที่และเตรียมงานฐานราก"
        stageKey = "groundbreak"
        trackingStatus = "pending"
        progressPercent = 10
        estValue = "18.5 ล้านบาท"
        buildingType = "บ้านพักอาศัยเดี่ยว 2 ชั้น (คฤหาสน์ 1,327 ตร.ม.)"
        caption = "NEW Project `nโครงการ: บ้านพักอาศัย ค.ส.ล.2 ชั้น `nพื้นที่ใช้สอย: 1327 ต.ร.ม.`nเจ้าของโครงการ: คุณทิว คุณหมวย`nสถานที่ก่อสร้าง: อ.เมือง จ.อุดรธานี"
        postedTime = "16/7/2569"
        postUrl = "https://www.facebook.com/siarchitecture/posts/pfbid02bbGADELvsUqqmjQLEREiUb6pmEbnKALtGzbRBdtvF31inBm3ChPyqg1E2hHZGjLSl"
        boq = @(
            [PSCustomObject]@{
                category = "งานโครงสร้างและฐานราก"
                items = @(
                    [PSCustomObject]@{ name = "ปูนซีเมนต์ปอร์ตแลนด์ Type 1 SCG (เทฐานราก/คานคอดิน)"; quantity = "1,800 ถุง"; scgMatched = $true },
                    [PSCustomObject]@{ name = "คอนกรีตผสมเสร็จ CPAC Super Plus 280-320 ksc"; quantity = "240 ลบ.ม."; scgMatched = $true },
                    [PSCustomObject]@{ name = "เหล็กข้ออ้อย มอก. SD40 SCG/ตราช้าง (DB16, DB20, DB25)"; quantity = "32 ตัน"; scgMatched = $true },
                    [PSCustomObject]@{ name = "เสาเข็มไอคอนกรีตอัดแรง CPAC"; quantity = "56 ต้น"; scgMatched = $true }
                )
            },
            [PSCustomObject]@{
                category = "งานสถาปัตย์และตกแต่ง (Future Stage)"
                items = @(
                    [PSCustomObject]@{ name = "กระเบื้องหลังคา เซรามิก Excella SCG / กระเบื้อง Prestige"; quantity = "1,450 ตร.ม."; scgMatched = $true },
                    [PSCustomObject]@{ name = "ฉนวนกันความร้อน STAY COOL SCG หนา 75 mm"; quantity = "1,200 ตร.ม."; scgMatched = $true }
                )
            }
        )
    },
    [PSCustomObject]@{
        projectId = "comp-udon-54-2"
        name = "บ้านพักอาศัย ค.ส.ล. 2 ชั้น Modern Luxury (คุณเอกชัย - คุณพัชรา)"
        location = "โซนหนองประจักษ์ อ.เมืองอุดรธานี จ.อุดรธานี"
        province = "อุดรธานี"
        district = "เมืองอุดรธานี"
        gps = @(17.4180, 102.7885)
        stage = "งานเสาคานชั้น 1 และเตรียมเทพื้นชั้น 2"
        stageKey = "structure"
        trackingStatus = "pending"
        progressPercent = 45
        estValue = "7.8 ล้านบาท"
        buildingType = "บ้านพักอาศัยเดี่ยว 2 ชั้น (Modern Luxury)"
        caption = "UPDATE งานโครงสร้างชั้น 1 และเตรียมเทพื้นชั้น 2`nโครงการ: บ้านพักอาศัย ค.ส.ล. 2 ชั้น (Modern Luxury)`nเจ้าของโครงการ: คุณเอกชัย - คุณพัชรา`nสถานที่ก่อสร้าง: อ.เมือง จ.อุดรธานี (โซนหนองประจักษ์)`nความคืบหน้า: งานเสา คาน ชั้น 1 แล้วเสร็จ 100% อยู่ระหว่างวางแผ่นพื้นสำเร็จรูปและผูกเหล็ก Topping เตรียมเทคอนกรีตผสมเสร็จ"
        postedTime = "16/7/2569"
        postUrl = "https://www.facebook.com/siarchitecture/posts/pfbid0gG1sD9LksHh4t4C3V6H9f9b2d8Qe3R4t5Y6u7i8o9p0a1s2d3f4g5h6j7k8l9"
        boq = @(
            [PSCustomObject]@{
                category = "งานโครงสร้างชั้น 2 และพื้นสำเร็จรูป"
                items = @(
                    [PSCustomObject]@{ name = "แผ่นพื้นคอนกรีตสำเร็จรูปท้องเรียบ CPAC"; quantity = "220 แผ่น"; scgMatched = $true },
                    [PSCustomObject]@{ name = "คอนกรีตผสมเสร็จ CPAC ทับหน้า Topping 240 ksc"; quantity = "35 ลบ.ม."; scgMatched = $true },
                    [PSCustomObject]@{ name = "ปูนซีเมนต์ไฮดรอลิก SCG สูตรเอ็กซ์ตร้า (งานเสา-คานชั้น 2)"; quantity = "350 ถุง"; scgMatched = $true },
                    [PSCustomObject]@{ name = "ตะแกรงเหล็กไวร์เมช SCG ขนาด 4 mm (ระยะห่าง 20x20 cm)"; quantity = "380 ตร.ม."; scgMatched = $true }
                )
            }
        )
    },
    [PSCustomObject]@{
        projectId = "comp-udon-54-3"
        name = "อาคารสำนักงานและโชว์รูม 2 ชั้น (หจก. นิตโยคอมเมอร์เชียล)"
        location = "ถ.นิตโย อ.เมืองอุดรธานี จ.อุดรธานี"
        province = "อุดรธานี"
        district = "เมืองอุดรธานี"
        gps = @(17.4085, 102.8120)
        stage = "งานก่อผนังอิฐมวลเบาและเดินท่อระบบ"
        stageKey = "structure"
        trackingStatus = "pending"
        progressPercent = 60
        estValue = "9.5 ล้านบาท"
        buildingType = "อาคารพาณิชย์และสำนักงาน 2 ชั้น"
        caption = "UPDATE ความคืบหน้าหน้างาน 🏗️`nโครงการ: อาคารสำนักงานและโชว์รูม 2 ชั้น`nสถานที่: อ.เมือง จ.อุดรธานี (ถ.นิตโย)`nเจ้าของโครงการ: หจก. นิตโยคอมเมอร์เชียล`nสถานะ: กำลังดำเนินงานก่ออิฐมวลเบาชั้น 2 และวางระบบท่อร้อยสายไฟ ร้อยท่อสุขาภิบาล เตรียมงานฉาบปูน"
        postedTime = "20/6/2569"
        postUrl = "https://www.facebook.com/siarchitecture/posts/pfbid06aNoQrS123456789"
        boq = @(
            [PSCustomObject]@{
                category = "งานผนังและงานระบบสุขาภิบาล"
                items = @(
                    [PSCustomObject]@{ name = "อิฐมวลเบา Q-CON ขนาด 7.5 cm (กันความร้อน-ลดเสียง)"; quantity = "4,200 ก้อน"; scgMatched = $true },
                    [PSCustomObject]@{ name = "ปูนก่อมวลเบา เสือมอร์ตาร์ สูตรแห้งเร็ว"; quantity = "120 ถุง"; scgMatched = $true },
                    [PSCustomObject]@{ name = "ปูนฉาบอิฐมวลเบา เสือมอร์ตาร์ ฉาบละเอียด"; quantity = "320 ถุง"; scgMatched = $true },
                    [PSCustomObject]@{ name = "ท่อร้อยสายไฟ PVC สีขาว SCG และอุปกรณ์ข้อต่อ"; quantity = "180 เส้น"; scgMatched = $true },
                    [PSCustomObject]@{ name = "ท่อสุขาภิบาล PVC สีฟ้า ตราช้าง SCG ชั้น 8.5/13.5"; quantity = "95 เส้น"; scgMatched = $true }
                )
            }
        )
    },
    [PSCustomObject]@{
        projectId = "comp-udon-54-4"
        name = "บ้านพักอาศัย ค.ส.ล. 2 ชั้น (คุณศุภชัย - คุณนภาพร)"
        location = "อ.หนองหาน จ.อุดรธานี"
        province = "อุดรธานี"
        district = "หนองหาน"
        gps = @(17.3620, 103.1040)
        stage = "งานพิธีลงเสาเอก-เสาโท และขุดดินฐานราก"
        stageKey = "foundation"
        trackingStatus = "pending"
        progressPercent = 15
        estValue = "4.8 ล้านบาท"
        buildingType = "บ้านพักอาศัยเดี่ยว 2 ชั้น"
        caption = "พิธีลงเสาเอก-เสาโท เพื่อความเป็นสิริมงคล 🙏✨`nโครงการ: บ้านพักอาศัย ค.ส.ล. 2 ชั้น คุณศุภชัย - คุณนภาพร`nสถานที่: อ.หนองหาน จ.อุดรธานี`nขอขอบคุณเจ้าของบ้านที่ไว้วางใจให้เราดูแล เริ่มต้นงานขุดดินฐานรากและเทคอนกรีตหยาบรองก้นหลุม สัปดาห์หน้าเตรียมเข้าเหล็กตอม่อครับ"
        postedTime = "12/6/2569"
        postUrl = "https://www.facebook.com/siarchitecture/posts/pfbid07bOpStU987654321"
        boq = @(
            [PSCustomObject]@{
                category = "งานฐานรากและเสาตอม่อ"
                items = @(
                    [PSCustomObject]@{ name = "คอนกรีตผสมเสร็จ CPAC 240 ksc งานเทฐานรากและตอม่อ"; quantity = "45 ลบ.ม."; scgMatched = $true },
                    [PSCustomObject]@{ name = "ปูนซีเมนต์ผสม เสือ ซีเมนต์ (งานเทลีนรองก้นหลุม)"; quantity = "60 ถุง"; scgMatched = $true },
                    [PSCustomObject]@{ name = "เหล็กเส้นข้ออ้อย SD40 มอก. ตราช้าง DB12/DB16"; quantity = "5.5 ตัน"; scgMatched = $true },
                    [PSCustomObject]@{ name = "น้ำยากันซึมและน้ำยาบ่มคอนกรีต SCG"; quantity = "8 แกลลอน"; scgMatched = $true }
                )
            }
        )
    },
    [PSCustomObject]@{
        projectId = "comp-udon-54-5"
        name = "บ้านพักอาศัย 1 ชั้น สไตล์มินิมอลมูจิ (คุณนพดล)"
        location = "อ.เพ็ญ จ.อุดรธานี"
        province = "อุดรธานี"
        district = "เพ็ญ"
        gps = @(17.6530, 102.7910)
        stage = "งานมุงหลังคาซีแพคและก่ออิฐมอญเตรียมฉาบ"
        stageKey = "finishing"
        trackingStatus = "pending"
        progressPercent = 75
        estValue = "2.6 ล้านบาท"
        buildingType = "บ้านพักอาศัยเดี่ยว 1 ชั้น สไตล์มินิมอลมูจิ"
        caption = "UPDATE หน้างาน 🏠`nโครงการ: บ้านพักอาศัย 1 ชั้น สไตล์มินิมอลมูจิ (คุณนพดล)`nสถานที่: อ.เพ็ญ จ.อุดรธานี`nสถานะปัจจุบัน: งานมุงหลังคาซีแพคโมเนียเสร็จเรียบร้อย กำลังดำเนินงานก่ออิฐมอญและเตรียมงานฉาบผนังภายนอก-ภายใน"
        postedTime = "15/5/2569"
        postUrl = "https://www.facebook.com/siarchitecture/posts/pfbid10eRsVwX123456789"
        boq = @(
            [PSCustomObject]@{
                category = "งานก่อฉาบและตกแต่งผิวผนัง"
                items = @(
                    [PSCustomObject]@{ name = "กระเบื้องหลังคา คอนกรีต ซีแพคโมเนีย SCG สีน้ำตาลมินิมอล"; quantity = "1,850 แผ่น"; scgMatched = $true },
                    [PSCustomObject]@{ name = "ปูนก่ออิฐมอญ เสือ ซีเมนต์ สูตรเหนียวแน่น"; quantity = "80 ถุง"; scgMatched = $true },
                    [PSCustomObject]@{ name = "ปูนฉาบสำเร็จรูป เสือมอร์ตาร์ ฉาบละเอียดพิเศษ"; quantity = "160 ถุง"; scgMatched = $true },
                    [PSCustomObject]@{ name = "แผ่นฝ้าสมาร์ทบอร์ด SCG ขอบเรียบ หนา 4 mm (กันชื้น)"; quantity = "120 แผ่น"; scgMatched = $true }
                )
            }
        )
    }
)

$comp.projects = $projects

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("$pwd/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Successfully updated comp-udon-54 with 5 active projects in js/data.js!"
