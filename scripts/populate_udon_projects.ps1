# -*- coding: utf-8 -*-
# Script to populate full realistic multi-project dataset for all 33 Udon Thani Builder Pages

$companiesData = @(
    @{
        id = "udon-comp-01"
        name = "มหารุ่งโรจน์ รับสร้างบ้าน อุดรธานี"
        engName = "Maharungroj House Builder Udon Thani"
        category = "รับสร้างบ้านคุณภาพและออกแบบสถาปัตยกรรม เพจ: maharungroj"
        province = "อุดรธานี"
        district = "เมืองอุดรธานี"
        address = "ถ.ทหาร ต.หมากแข้ง อ.เมือง จ.อุดรธานี 41000"
        phone = "042-246-888, 081-965-7788"
        contactPerson = "คุณมหารุ่งโรจน์ (ผู้บริหาร)"
        growthRate = 45
        areaExpansion = "ครอบคลุม อ.เมืองอุดรธานี, อ.หนองหาน, อ.กุมภวาปี"
        facebookUrl = "https://www.facebook.com/maharungroj/?locale=th_TH"
        coords = @(17.4080, 102.7980)
        aiShortRec = "🎯 เพจทางการ: มหารุ่งโรจน์ อุดรธานี"
        aiRecommendation = "มีงานเปิดไซต์ใหม่ 3 แห่ง แนะนำเข้าเจรจาล็อกสเปกปูนโครงสร้าง SCG และคอนกรีตผสมเสร็จ CPAC"
        projects = @(
            @{
                projectId = "proj-udon-01-1"
                name = "โครงการบ้านเดี่ยวสไตล์คอนเทมโพรารี หนองใส"
                location = "ต.หนองบัว อ.เมือง จ.อุดรธานี"
                province = "อุดรธานี"
                district = "เมืองอุดรธานี"
                gps = @(17.4120, 102.8150)
                stage = "พึ่งเริ่มตอกเสาเข็มและวางผังอาคาร"
                stageKey = "groundbreak"
                trackingStatus = "pending"
                progressPercent = 15
                estValue = "4.5 ล้านบาท"
                buildingType = "บ้านเดี่ยว 2 ชั้น (220 ตร.ม.)"
                caption = "พิธียกเสาเอก-เสาโท บ้านพักอาศัยคุณพิชัย บ้านหนองใส อ.เมือง จ.อุดรธานี ฤกษ์ดีวันนี้ ลุยงานโครงสร้างต่อครับ #มหารุ่งโรจน์ #รับสร้างบ้านอุดร"
                postedTime = "3 วันที่แล้ว"
                postUrl = "https://www.facebook.com/maharungroj/?locale=th_TH"
                boq = @(
                    @{ sku = "ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง"; qty = "450 ถุง"; estCost = "฿76,500"; urgency = "ด่วนที่สุด" },
                    @{ sku = "คอนกรีตผสมเสร็จ CPAC 240 ksc"; qty = "75 คิว"; estCost = "฿165,000"; urgency = "เตรียมสั่งซื้อ" }
                )
            },
            @{
                projectId = "proj-udon-01-2"
                name = "บ้านพักอาศัยโมเดิร์นคลาสสิก อ.หนองหาน"
                location = "ต.หนองหาน อ.หนองหาน จ.อุดรธานี"
                province = "อุดรธานี"
                district = "หนองหาน"
                gps = @(17.3620, 103.1050)
                stage = "เทฐานราก ตอม่อ และคานคอดิน"
                stageKey = "foundation"
                trackingStatus = "in_progress"
                progressPercent = 35
                estValue = "5.2 ล้านบาท"
                buildingType = "บ้านเดี่ยว 2 ชั้น Modern Luxury"
                caption = "อัปเดตหน้างาน อ.หนองหาน จ.อุดรธานี กำลังเทคอนกรีตฐานรากและหล่อเสาตอม่อ งานเรียบร้อยตามมาตรฐานวิศวกรรม"
                postedTime = "8 วันที่แล้ว"
                postUrl = "https://www.facebook.com/maharungroj/?locale=th_TH"
                boq = @(
                    @{ sku = "คอนกรีตผสมเสร็จ CPAC 280 ksc"; qty = "90 คิว"; estCost = "฿207,000"; urgency = "กำลังใช้งาน" },
                    @{ sku = "เหล็กข้ออ้อยและปูน SCG"; qty = "300 ถุง"; estCost = "฿51,000"; urgency = "กำลังใช้งาน" }
                )
            },
            @{
                projectId = "proj-udon-01-3"
                name = "บ้านสวนพูลวิลล่า อ.กุมภวาปี"
                location = "ต.พันดอน อ.กุมภวาปี จ.อุดรธานี"
                province = "อุดรธานี"
                district = "กุมภวาปี"
                gps = @(17.1150, 102.9750)
                stage = "ขึ้นโครงสร้างเสาคานและงานมุงหลังคา"
                stageKey = "structure"
                trackingStatus = "in_progress"
                progressPercent = 65
                estValue = "6.8 ล้านบาท"
                buildingType = "พูลวิลล่าชั้นเดียว Nordic Style"
                caption = "ส่งมอบงานมุงหลังคาและขึ้นโครงสร้างเสาคาน บ้านพักตากอากาศ อ.กุมภวาปี จ.อุดรธานี เตรียมเข้าสู่งานก่อฉาบผนัง"
                postedTime = "2 สัปดาห์ที่แล้ว"
                postUrl = "https://www.facebook.com/maharungroj/?locale=th_TH"
                boq = @(
                    @{ sku = "กระเบื้องหลังคา SCG NeuTile"; qty = "280 ตร.ม."; estCost = "฿196,000"; urgency = "กำลังใช้งาน" },
                    @{ sku = "อิฐมวลเบา Q-CON 7.5 ซม."; qty = "2,500 ก้อน"; estCost = "฿55,000"; urgency = "เตรียมสั่งซื้อ" }
                )
            }
        )
    },
    @{
        id = "udon-comp-02"
        name = "UD.Home รับสร้างบ้าน อุดรธานี"
        engName = "UD.Home Engineering & Construction"
        category = "รับสร้างบ้านโมเดิร์นและงานวิศวกรรม เพจ: UD.HomeEn"
        province = "อุดรธานี"
        district = "เมืองอุดรธานี"
        address = "ถ.รอบเมือง ต.หนองบัว อ.เมือง จ.อุดรธานี 41000"
        phone = "089-712-3456, 042-321-789"
        contactPerson = "ทีมวิศวกร UD.Home"
        growthRate = 42
        areaExpansion = "ครอบคลุม อ.เมืองอุดรธานี, อ.กุดจับ, อ.หนองวัวซอ"
        facebookUrl = "https://www.facebook.com/UD.HomeEn/?locale=th_TH"
        coords = @(17.3950, 102.8250)
        aiShortRec = "🎯 เพจทางการ: UD.Home อุดรธานี"
        aiRecommendation = "มีโปรเจกต์งานโครงสร้างและเริ่มตอกเสาเข็มใน อ.เมือง และ อ.กุดจับ เซลส์ควรเข้าพบล็อกสเปกหลังคาและปูนเสือ"
        projects = @(
            @{
                projectId = "proj-udon-02-1"
                name = "บ้านโมเดิร์นลอฟท์ อ.เมืองอุดรธานี"
                location = "ต.บ้านจั่น อ.เมือง จ.อุดรธานี"
                province = "อุดรธานี"
                district = "เมืองอุดรธานี"
                gps = @(17.3750, 102.8100)
                stage = "พึ่งเริ่มตอกเสาเข็มและขุดหลุมฐานราก"
                stageKey = "groundbreak"
                trackingStatus = "pending"
                progressPercent = 10
                estValue = "3.8 ล้านบาท"
                buildingType = "บ้านเดี่ยวชั้นเดียว Modern Loft"
                caption = "เข้าหน้างานเช้านี้ ขุดหลุมฐานรากและลงเสาเข็ม บ้านคุณกิตติ ต.บ้านจั่น อ.เมือง จ.อุดรธานี มาตรฐาน UD.Home"
                postedTime = "1 วันที่แล้ว"
                postUrl = "https://www.facebook.com/UD.HomeEn/?locale=th_TH"
                boq = @(
                    @{ sku = "ปูนซีเมนต์ไฮดรอลิก SCG"; qty = "350 ถุง"; estCost = "฿59,500"; urgency = "ด่วนที่สุด" },
                    @{ sku = "คอนกรีตผสมเสร็จ CPAC 240 ksc"; qty = "55 คิว"; estCost = "฿121,000"; urgency = "เตรียมสั่งซื้อ" }
                )
            },
            @{
                projectId = "proj-udon-02-2"
                name = "โครงการบ้านปั้นหยา อ.กุดจับ"
                location = "ต.เมืองเพีย อ.กุดจับ จ.อุดรธานี"
                province = "อุดรธานี"
                district = "กุดจับ"
                gps = @(17.4350, 102.5750)
                stage = "ขึ้นโครงสร้างเสาคานและคานหลังคา"
                stageKey = "structure"
                trackingStatus = "in_progress"
                progressPercent = 55
                estValue = "4.2 ล้านบาท"
                buildingType = "บ้านเดี่ยว 2 ชั้น สไตล์ปั้นหยา"
                caption = "อัปเดตงานโครงสร้างเสาคานชั้นบนและเตรียมตั้งจันทัน โครงการบ้าน อ.กุดจับ จ.อุดรธานี ลูกค้าเลือกใช้กระเบื้องหลังคาซีแพคโมเนีย"
                postedTime = "5 วันที่แล้ว"
                postUrl = "https://www.facebook.com/UD.HomeEn/?locale=th_TH"
                boq = @(
                    @{ sku = "กระเบื้องหลังคา SCG Prestige"; qty = "240 ตร.ม."; estCost = "฿168,000"; urgency = "ด่วนที่สุด" },
                    @{ sku = "ปูนเสือมอร์ตาร์ งานก่อฉาบ"; qty = "280 ถุง"; estCost = "฿39,200"; urgency = "เตรียมสั่งซื้อ" }
                )
            },
            @{
                projectId = "proj-udon-02-3"
                name = "บ้านพักอาศัยร่วมสมัย อ.หนองวัวซอ"
                location = "ต.หนองอ้อ อ.หนองวัวซอ จ.อุดรธานี"
                province = "อุดรธานี"
                district = "หนองวัวซอ"
                gps = @(17.1650, 102.5850)
                stage = "งานก่อฉาบ ติดตั้งระบบ และตกแต่งสถาปัตย์"
                stageKey = "finishing"
                trackingStatus = "completed"
                progressPercent = 90
                estValue = "3.5 ล้านบาท"
                buildingType = "บ้านเดี่ยวชั้นเดียว Contemporary"
                caption = "ตรวจรับงวดงานฉาบปูนเสือและเตรียมติดตั้งสุขภัณฑ์ COTTO โครงการบ้านคุณประเสริฐ อ.หนองวัวซอ จ.อุดรธานี ใกล้ส่งมอบแล้วครับ"
                postedTime = "3 สัปดาห์ที่แล้ว"
                postUrl = "https://www.facebook.com/UD.HomeEn/?locale=th_TH"
                boq = @(
                    @{ sku = "สุขภัณฑ์และกระเบื้อง COTTO"; qty = "3 ชุด"; estCost = "฿72,000"; urgency = "ส่งมอบแล้ว" },
                    @{ sku = "ปูนเสือมอร์ตาร์ ฉาบสูตรละเอียด"; qty = "200 ถุง"; estCost = "฿28,000"; urgency = "ส่งมอบแล้ว" }
                )
            }
        )
    },
    @{
        id = "udon-comp-03"
        name = "โมเดิร์น ดี รับสร้างบ้าน (Modern De)"
        engName = "Modern De House Builder"
        category = "รับสร้างบ้านลักชัวรี่-พรีเมียม เพจ: MODERNDEHouseBuilder"
        province = "อุดรธานี"
        district = "เมืองอุดรธานี"
        address = "ถ.อุดรดุษฎี ต.หมากแข้ง อ.เมือง จ.อุดรธานี 41000"
        phone = "042-223-333, 086-455-9988"
        contactPerson = "คุณโมเดิร์นดี"
        growthRate = 50
        areaExpansion = "ครอบคลุม อ.เมืองอุดรธานี, อ.เพ็ญ, อ.บ้านผือ"
        facebookUrl = "https://www.facebook.com/MODERNDEHouseBuilder/?locale=th_TH"
        coords = @(17.4190, 102.7910)
        aiShortRec = "🎯 เพจทางการ: โมเดิร์น ดี อุดรธานี"
        aiRecommendation = "บริษัทชั้นนำงานบ้าน Luxury มี 4 โครงการขนาดใหญ่ แนะนำเสนอหลังคา Excella และไม้ตกแต่ง SCG D-COR"
        projects = @(
            @{
                projectId = "proj-udon-03-1"
                name = "คฤหาสน์หรู Modern Luxury ถ.รอบเมือง"
                location = "ต.หมูม่น อ.เมือง จ.อุดรธานี"
                province = "อุดรธานี"
                district = "เมืองอุดรธานี"
                gps = @(17.4450, 102.7850)
                stage = "พึ่งเริ่มตอกเสาเข็มและวางฐานราก"
                stageKey = "groundbreak"
                trackingStatus = "pending"
                progressPercent = 15
                estValue = "12.5 ล้านบาท"
                buildingType = "คฤหาสน์ 2 ชั้น (450 ตร.ม.)"
                caption = "เปิดหน้างานใหม่ คฤหาสน์หรู Modern Luxury ต.หมูม่น อ.เมือง จ.อุดรธานี เริ่มเจาะเสาเข็มและเทฐานราก CPAC 320 ksc #ModernDe"
                postedTime = "2 วันที่แล้ว"
                postUrl = "https://www.facebook.com/MODERNDEHouseBuilder/?locale=th_TH"
                boq = @(
                    @{ sku = "คอนกรีตผสมเสร็จ CPAC Super Plus 320 ksc"; qty = "160 คิว"; estCost = "฿384,000"; urgency = "ด่วนที่สุด" },
                    @{ sku = "ปูนซีเมนต์ไฮดรอลิก SCG"; qty = "600 ถุง"; estCost = "฿102,000"; urgency = "เตรียมสั่งซื้อ" }
                )
            },
            @{
                projectId = "proj-udon-03-2"
                name = "บ้านเดี่ยวโมเดิร์นลักชัวรี่ อ.เพ็ญ"
                location = "ต.เพ็ญ อ.เพ็ญ จ.อุดรธานี"
                province = "อุดรธานี"
                district = "เพ็ญ"
                gps = @(17.6850, 102.9450)
                stage = "เทฐานราก ตอม่อ และคานคอดิน"
                stageKey = "foundation"
                trackingStatus = "in_progress"
                progressPercent = 30
                estValue = "6.5 ล้านบาท"
                buildingType = "บ้านเดี่ยว 2 ชั้น Modern Nordic"
                caption = "อัปเดตไซต์งาน อ.เพ็ญ จ.อุดรธานี ผูกเหล็กคานคอดินและเตรียมเทคอนกรีตฐานราก ทีมงานควบคุมคุณภาพทุกจุด"
                postedTime = "1 สัปดาห์ที่แล้ว"
                postUrl = "https://www.facebook.com/MODERNDEHouseBuilder/?locale=th_TH"
                boq = @(
                    @{ sku = "คอนกรีตผสมเสร็จ CPAC 280 ksc"; qty = "85 คิว"; estCost = "฿195,500"; urgency = "กำลังใช้งาน" },
                    @{ sku = "เหล็กโครงสร้างและปูน SCG"; qty = "320 ถุง"; estCost = "฿54,400"; urgency = "กำลังใช้งาน" }
                )
            },
            @{
                projectId = "proj-udon-03-3"
                name = "โครงการบ้านพักตากอากาศ อ.บ้านผือ"
                location = "ต.บ้านผือ อ.บ้านผือ จ.อุดรธานี"
                province = "อุดรธานี"
                district = "บ้านผือ"
                gps = @(17.6950, 102.4750)
                stage = "ขึ้นโครงสร้างเสาคานและงานมุงหลังคา"
                stageKey = "structure"
                trackingStatus = "in_progress"
                progressPercent = 60
                estValue = "8.2 ล้านบาท"
                buildingType = "บ้านสไตล์ Modern Tropical"
                caption = "ขึ้นโครงหลังคาเหล็กและเตรียมมุงกระเบื้องเซรามิก SCG Excella โครงการ อ.บ้านผือ จ.อุดรธานี สวยงามอลังการ"
                postedTime = "10 วันที่แล้ว"
                postUrl = "https://www.facebook.com/MODERNDEHouseBuilder/?locale=th_TH"
                boq = @(
                    @{ sku = "กระเบื้องหลังคา SCG Excella Modern"; qty = "320 ตร.ม."; estCost = "฿320,000"; urgency = "ด่วนที่สุด" },
                    @{ sku = "ฉนวนกันความร้อน SCG STAY COOL"; qty = "40 ม้วน"; estCost = "฿36,000"; urgency = "เตรียมสั่งซื้อ" }
                )
            },
            @{
                projectId = "proj-udon-03-4"
                name = "บ้านเดี่ยวพูลวิลล่า อ.เมืองอุดรธานี"
                location = "ต.บ้านเลื่อม อ.เมือง จ.อุดรธานี"
                province = "อุดรธานี"
                district = "เมืองอุดรธานี"
                gps = @(17.4250, 102.7750)
                stage = "งานก่อฉาบ ติดตั้งระบบ และตกแต่งสถาปัตย์"
                stageKey = "finishing"
                trackingStatus = "completed"
                progressPercent = 88
                estValue = "7.8 ล้านบาท"
                buildingType = "บ้านเดี่ยว 2 ชั้น พร้อมสระว่ายน้ำ"
                caption = "งานก่ออิฐมวลเบา Q-CON และฉาบเรียบผนังภายใน ต.บ้านเลื่อม อ.เมือง จ.อุดรธานี เตรียมงานตกแต่งฝ้าสมาร์ทบอร์ด"
                postedTime = "1 เดือนที่แล้ว"
                postUrl = "https://www.facebook.com/MODERNDEHouseBuilder/?locale=th_TH"
                boq = @(
                    @{ sku = "อิฐมวลเบา Q-CON ขนาด 7.5 ซม."; qty = "3,200 ก้อน"; estCost = "฿70,400"; urgency = "ส่งมอบแล้ว" },
                    @{ sku = "แผ่นฝ้าสมาร์ทบอร์ด SCG"; qty = "150 แผ่น"; estCost = "฿28,500"; urgency = "ส่งมอบแล้ว" }
                )
            }
        )
    },
    @{
        id = "udon-comp-29"
        name = "Baron House รับสร้างบ้านและดีไซน์"
        engName = "Baron House Design"
        category = "ออกแบบสถาปัตยกรรมและรับสร้างบ้าน เพจ: BaronHouseDesign"
        province = "อุดรธานี"
        district = "เมืองอุดรธานี"
        address = "ถ.นิตโย ต.หมากแข้ง อ.เมือง จ.อุดรธานี 41000"
        phone = "088-562-4455, 042-182-333"
        contactPerson = "สถาปนิก Baron House"
        growthRate = 55
        areaExpansion = "ครอบคลุม อ.เมืองอุดรธานี, อ.หนองหาน, อ.บ้านดุง, อ.กุมภวาปี, อ.เพ็ญ"
        facebookUrl = "https://www.facebook.com/BaronHouseDesign/"
        coords = @(17.4110, 102.8020)
        aiShortRec = "🎯 เพจทางการ: Baron House"
        aiRecommendation = "ผู้รับเหมาพรีเมียมอันดับ 1 มี 5 ไซต์งานจริงทั่วอุดรธานี AI Score สูงถึง 92 แนะนำเข้าพบล็อกสเปกยกพอร์ต"
        projects = @(
            @{
                projectId = "proj-udon-29-1"
                name = "โครงการบ้านหรูโมเดิร์นลักชัวรี่ อ.เมืองอุดรธานี"
                location = "ต.โนนสูง อ.เมือง จ.อุดรธานี"
                province = "อุดรธานี"
                district = "เมืองอุดรธานี"
                gps = @(17.3250, 102.8450)
                stage = "พึ่งเริ่มตอกเสาเข็มและหล่อตอม่อ"
                stageKey = "groundbreak"
                trackingStatus = "pending"
                progressPercent = 12
                estValue = "9.5 ล้านบาท"
                buildingType = "บ้านเดี่ยว 2 ชั้น Modern Luxury"
                caption = "เริ่มตอกเสาเข็มหน้างาน ต.โนนสูง อ.เมือง จ.อุดรธานี บ้านหรู 2 ชั้น สไตล์ Modern Luxury คุมงานโดยทีมสถาปนิกและวิศวกร #BaronHouse"
                postedTime = "1 วันที่แล้ว"
                postUrl = "https://www.facebook.com/BaronHouseDesign/"
                boq = @(
                    @{ sku = "คอนกรีตผสมเสร็จ CPAC 280 ksc"; qty = "110 คิว"; estCost = "฿253,000"; urgency = "ด่วนที่สุด" },
                    @{ sku = "ปูนซีเมนต์ไฮดรอลิก SCG"; qty = "450 ถุง"; estCost = "฿76,500"; urgency = "ด่วนที่สุด" }
                )
            },
            @{
                projectId = "proj-udon-29-2"
                name = "บ้านเดี่ยวสไตล์นอร์ดิกมินิมอล อ.หนองหาน"
                location = "ต.บ้านเชียง อ.หนองหาน จ.อุดรธานี"
                province = "อุดรธานี"
                district = "หนองหาน"
                gps = @(17.4120, 103.2350)
                stage = "เทฐานรากและคานคอดิน"
                stageKey = "foundation"
                trackingStatus = "in_progress"
                progressPercent = 28
                estValue = "5.8 ล้านบาท"
                buildingType = "บ้านพักอาศัยชั้นเดียว Nordic Minimal"
                caption = "อัปเดตหน้างาน ต.บ้านเชียง อ.หนองหาน จ.อุดรธานี เทฐานรากและคานคอดินเรียบร้อย เตรียมขึ้นเสาชั้น 1"
                postedTime = "4 วันที่แล้ว"
                postUrl = "https://www.facebook.com/BaronHouseDesign/"
                boq = @(
                    @{ sku = "คอนกรีตผสมเสร็จ CPAC 240 ksc"; qty = "70 คิว"; estCost = "฿154,000"; urgency = "กำลังใช้งาน" },
                    @{ sku = "ปูนโครงสร้าง SCG"; qty = "260 ถุง"; estCost = "฿44,200"; urgency = "กำลังใช้งาน" }
                )
            },
            @{
                projectId = "proj-udon-29-3"
                name = "คฤหาสน์หรูริมสระน้ำ อ.กุมภวาปี"
                location = "ต.พันดอน อ.กุมภวาปี จ.อุดรธานี"
                province = "อุดรธานี"
                district = "กุมภวาปี"
                gps = @(17.1250, 102.9650)
                stage = "ขึ้นโครงสร้างเสาคานและคานหลังคา"
                stageKey = "structure"
                trackingStatus = "in_progress"
                progressPercent = 52
                estValue = "11.2 ล้านบาท"
                buildingType = "คฤหาสน์ 2 ชั้น สไตล์ร่วมสมัย"
                caption = "งานโครงสร้างเสาคานชั้น 2 และติดตั้งเหล็กโครงหลังคา อ.กุมภวาปี จ.อุดรธานี วางแผนมุงกระเบื้องหลังคา SCG Prestige สัปดาห์หน้า"
                postedTime = "1 สัปดาห์ที่แล้ว"
                postUrl = "https://www.facebook.com/BaronHouseDesign/"
                boq = @(
                    @{ sku = "กระเบื้องหลังคา SCG Prestige"; qty = "380 ตร.ม."; estCost = "฿266,000"; urgency = "ด่วนที่สุด" },
                    @{ sku = "ไม้สังเคราะห์ SCG D-COR"; qty = "95 ตร.ม."; estCost = "฿42,750"; urgency = "เตรียมสั่งซื้อ" }
                )
            },
            @{
                projectId = "proj-udon-29-4"
                name = "บ้านพักอาศัยโมเดิร์นคอนเทมโพรารี อ.บ้านดุง"
                location = "ต.บ้านดุง อ.บ้านดุง จ.อุดรธานี"
                province = "อุดรธานี"
                district = "บ้านดุง"
                gps = @(17.6980, 103.2550)
                stage = "งานก่อฉาบ ติดตั้งระบบ และตกแต่งสถาปัตย์"
                stageKey = "finishing"
                trackingStatus = "completed"
                progressPercent = 85
                estValue = "6.4 ล้านบาท"
                buildingType = "บ้านเดี่ยว 2 ชั้น Contemporary"
                caption = "เข้างานก่ออิฐมวลเบา Q-CON และฉาบเรียบปูนเสือมอร์ตาร์ อ.บ้านดุง จ.อุดรธานี งานเรียบร้อยสวยงามตามสเปก"
                postedTime = "2 สัปดาห์ที่แล้ว"
                postUrl = "https://www.facebook.com/BaronHouseDesign/"
                boq = @(
                    @{ sku = "อิฐมวลเบา Q-CON 7.5 ซม."; qty = "2,800 ก้อน"; estCost = "฿61,600"; urgency = "ส่งมอบแล้ว" },
                    @{ sku = "ปูนเสือมอร์ตาร์ ฉาบสูตรละเอียด"; qty = "280 ถุง"; estCost = "฿33,600"; urgency = "ส่งมอบแล้ว" }
                )
            },
            @{
                projectId = "proj-udon-29-5"
                name = "บ้านสวนสไตล์โมเดิร์นทรอปิคอล อ.เพ็ญ"
                location = "ต.เพ็ญ อ.เพ็ญ จ.อุดรธานี"
                province = "อุดรธานี"
                district = "เพ็ญ"
                gps = @(17.6750, 102.9350)
                stage = "ขึ้นโครงสร้างเสาคานและงานมุงหลังคา"
                stageKey = "structure"
                trackingStatus = "in_progress"
                progressPercent = 60
                estValue = "4.9 ล้านบาท"
                buildingType = "บ้านเดี่ยวชั้นเดียว Modern Tropical"
                caption = "เทคานหลังคาและมุงกระเบื้องหลังคา อ.เพ็ญ จ.อุดรธานี วิวทุ่งนาธรรมชาติ สวยโปร่งโล่งสบาย #BaronHouseDesign"
                postedTime = "12 วันที่แล้ว"
                postUrl = "https://www.facebook.com/BaronHouseDesign/"
                boq = @(
                    @{ sku = "กระเบื้องหลังคา SCG NeuTile"; qty = "210 ตร.ม."; estCost = "฿147,000"; urgency = "กำลังใช้งาน" },
                    @{ sku = "ปูนเสือมอร์ตาร์"; qty = "200 ถุง"; estCost = "฿28,000"; urgency = "เตรียมสั่งซื้อ" }
                )
            }
        )
    }
)
