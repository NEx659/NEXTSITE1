$dataPath = "c:\Users\pannipan\Downloads\N\js\data.js"
$raw = [System.IO.File]::ReadAllText($dataPath, [System.Text.Encoding]::UTF8)

$firstBracket = $raw.IndexOf('[')
$lastBracket = $raw.LastIndexOf(']')
$prefix = $raw.Substring(0, $firstBracket)
$jsonStr = $raw.Substring($firstBracket, $lastBracket - $firstBracket + 1)
$suffix = $raw.Substring($lastBracket + 1)

$companies = $jsonStr | ConvertFrom-Json

foreach ($c in $companies) {
    if ($c.id -eq 'comp-udon-10') {
        $c.projects = @(
            [PSCustomObject]@{
                id = "proj-tt-01"
                name = "บ้านคุณโหน่ง อ.เมืองอุดรธานี (งานทาสีจริงภายนอก Modern Classic Luxury)"
                district = "เมืองอุดรธานี"
                stage = "งานสถาปัตย์ / ทาสีภายนอก"
                stageKey = "finishing"
                progressPercent = 88
                budgetMillion = 5.8
                lastUpdate = "2026-09-13"
                caption = "อัปเดต : งานทาสีจริงภายนอก ✨🖌️ ทีมช่างกำลังเก็บรายละเอียดงานสีตามองค์ประกอบทางสถาปัตยกรรม ช่วยถ่ายทอดความสง่างามของบ้านสไตล์ Modern Classic Luxury ให้ชัดเจนยิ่งขึ้น`n`nOwner : คุณโหน่ง`nlocation : อ.เมือง จ.อุดรธานี`n`n#TTDesignAndConstruction #มาตรฐานงานก่อสร้าง #ควบคุมคุณภาพ #ฝีมืองานก่อสร้าง #รับสร้างบ้านอุดรธานี"
                imageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80"
                facebookPostUrl = "https://www.facebook.com/permalink.php?story_fbid=pfbid0hDoPPxd2St8M69B8NFMXAK4yd5CEPNdeqn5914K6GuZpJ7MKTp46X6c1Kt9nr1i1l&id=100057515256596"
            },
            [PSCustomObject]@{
                id = "proj-tt-02"
                name = "Modern Classic Luxury Residence 800 ตร.ม."
                district = "เมืองอุดรธานี"
                stage = "งานโครงสร้างและมุงหลังคา"
                stageKey = "structure"
                progressPercent = 65
                budgetMillion = 12.5
                lastUpdate = "2026-09-07"
                caption = "SITE UPDATE | Modern Classic Luxury Residence 800 ตร.ม. EP.2`n`nอีกหนึ่งความคืบหน้าของบ้านพักอาศัย Modern Classic Luxury พื้นที่กว่า 800 ตารางเมตร`n`n#TTDesignAndConstruction #รับสร้างบ้านอุดรธานี #บ้านหรู800ตรม #ModernClassicLuxury #สร้างบ้านอุดรธานี #LuxuryHome #SiteUpdate"
                imageUrl = "https://scontent-ord5-1.xx.fbcdn.net/v/t15.5256-10/799601265_1895688415141967_7747066122974511844_n.jpg?stp=dst-jpg_tt6&cstp=mx576x1024&ctp=s960x960&_nc_cat=108&ccb=1-7&_nc_sid=d2b52d&_nc_ohc=mfibPNi5pw4Q7kNvwEvaZQN&_nc_oc=AdppV9xsVbd_GpY6mh0EiiKmniV0xJXQH3cXmFI502pnUzYsnTCU-pEk2mYPubcYeoT9ENYqT9kOYpz-I9p3u0kV&_nc_zt=23&_nc_ht=scontent-ord5-1.xx&_nc_gid=XDik1B1D-dzqLL5ZKsTnOA&_nc_ss=73289&oh=00_AQKkU_okXuhGDNLJe3PfJpNzM-XcppAN8iTPbxNOIv_qHA&oe=6AAF4BD7"
                facebookPostUrl = "https://www.facebook.com/reel/4626604687610763/"
            },
            [PSCustomObject]@{
                id = "proj-tt-03"
                name = "Modern Classic 365 ตร.ม. (งานปูกระเบื้อง)"
                district = "เมืองอุดรธานี"
                stage = "งานสถาปัตย์และปูกระเบื้อง"
                stageKey = "finishing"
                progressPercent = 82
                budgetMillion = 6.2
                lastUpdate = "2026-09-10"
                caption = "อัปเดตงานก่อสร้าง Modern Classic พื้นที่ 365 ตร.ม.`n`nสำหรับขั้นตอนงานปูกระเบื้องทั้งพื้นบ้านชั้นสอง ผนังห้องน้ำ ระดับน้ำ แนวรอยต่อทุกจุด ล้วนส่งผลต่อความสวยงามและการใช้งาน`n`nTT Design & Construction ใส่ใจทุกขั้นตอน เพื่อคุณภาพที่ตรวจสอบได้`n`n#รับสร้างบ้าน #บ้านโมเดิร์นคลาสสิค #งานปูกระเบื้อง #อัปเดตหน้างาน"
                imageUrl = "https://scontent-atl3-1.xx.fbcdn.net/v/t15.5256-10/802355698_2135379060658041_5481898874476382295_n.jpg?stp=dst-jpg_tt6&cstp=mx576x1024&ctp=s960x960&_nc_cat=110&ccb=1-7&_nc_sid=d2b52d&_nc_ohc=lPCPaOMecm0Q7kNvwFfXHFT&_nc_oc=AdqyDpf0h_2lejXsqWB3kxwHQ1JbAEm4d8-dJH12eEk-r1vYHPjEsIHtSebfo3wow9t9LpebpLWU6NtAe_7zwbIa&_nc_zt=23&_nc_ht=scontent-atl3-1.xx&_nc_gid=_4taUxUDCp2kB4IZSUMoWw&_nc_ss=73289&oh=00_AQKUmD1iRjmnoonGLnDOnC4iqB3IvR5nBFIKwj516uk-4w&oe=6AAF475B"
                facebookPostUrl = "https://www.facebook.com/reel/1440415724648857/"
            },
            [PSCustomObject]@{
                id = "proj-tt-04"
                name = "บ้านคุณตอง อ.กุมภวาปี (งานโครงสร้าง ค.ส.ล. ชั้น 1)"
                district = "กุมภวาปี"
                stage = "งานโครงสร้าง ค.ส.ล."
                stageKey = "structure"
                progressPercent = 45
                budgetMillion = 4.8
                lastUpdate = "2026-09-08"
                caption = "อัปเดต: งานโครงสร้าง ค.ส.ล. ชั้น 1`nงานฐานราก งานผูกเหล็ก จนถึงงานเทคอนกรีต ทุกกระบวนการควบคุมและตรวจสอบโดยวิศวกร บันทึกภาพความคืบหน้า เพื่อให้ตรวจสอบได้ทุกขั้นตอน`n`nOwner : คุณตอง`nlocation : อ.กุมภวาปี จ.อุดรธานี`n`n#TTDesignAndConstruction #มาตรฐานงานก่อสร้าง #ควบคุมคุณภาพ #งานโครงสร้าง #รับสร้างบ้านอุดรธานี"
                imageUrl = "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80"
                facebookPostUrl = "https://www.facebook.com/permalink.php?story_fbid=pfbid02NTxVoxooXPwnH62z6r9eZnWFT9kH9eHgrjmSqHQHEmE8wm5Up5T1jcKNujVTC3Zfl&id=100057515256596"
            },
            [PSCustomObject]@{
                id = "proj-tt-05"
                name = "บ้านคุณวราภรณ์ อ.เมืองอุดรธานี (งานบันไดไม้และสถาปัตย์)"
                district = "เมืองอุดรธานี"
                stage = "งานสถาปัตย์และตกแต่งภายใน"
                stageKey = "finishing"
                progressPercent = 90
                budgetMillion = 5.2
                lastUpdate = "2026-09-04"
                caption = "อัปเดต: งานบันไดไม้ อีกหนึ่งงานเฉพาะทางที่ต้องอาศัยความประณีตในทุกรายละเอียด วัสดุธรรมชาติ ลวดลาย โทนสี สัดส่วน จนถึงการติดตั้ง`n`nOwner : คุณวราภรณ์`nlocation : อ.เมือง จ.อุดรธานี`n`n#TTDesignAndConstruction #มาตรฐานงานก่อสร้าง #ควบคุมคุณภาพ #งานสถาปัตย์ #รับสร้างบ้านอุดรธานี"
                imageUrl = "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&auto=format&fit=crop&q=80"
                facebookPostUrl = "https://www.facebook.com/permalink.php?story_fbid=pfbid02mqamzuyMDUfMDjXuuQMeatyGiYo3kYPuA3pT1aTzjDGWJrDkcq3UBYwe1hqR87EFl&id=100057515256596"
            }
        )
        $c.totalProjects = $c.projects.Count
        $c.newProjectsThisMonth = $c.projects.Count
        $c.totalValueMillion = [Math]::Round(34.5, 1)
        
        $c.stageBreakdown = [PSCustomObject]@{
            groundbreak = 0
            foundation = 0
            structure = 2
            finishing = 3
        }
        $c.aiShortRec = "พบ 5 ไซต์งานก่อสร้างจริงใน จ.อุดรธานี (อ.เมือง 4 หลัง รวมทั้งบ้านคุณโหน่ง และ อ.กุมภวาปี 1 หลัง)"
    }
}

$newJson = $companies | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\data.js", ($prefix + $newJson + $suffix), [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\baseline_1_data.js", ($prefix + $newJson + $suffix), [System.Text.Encoding]::UTF8)

Write-Output "Successfully updated TT Design with all authentic Udon projects!"
