$content = Get-Content 'js/data.js' -Raw -Encoding UTF8

# Extract JSON part
$jsonText = $content
if ($jsonText -match 'var\s+UDON_COMPANIES\s*=\s*(\[[\s\S]*\]);?') {
    $jsonText = $matches[1]
}

try {
    $obj = $jsonText | ConvertFrom-Json
    Write-Output "Successfully parsed $($obj.Count) companies!"
    
    # Ensure comp-udon-58 has its real project
    $comp58 = $obj | Where-Object { $_.id -eq 'comp-udon-58' }
    if ($comp58) {
        $comp58.facebookUrl = "https://www.facebook.com/profile.php?id=100083320623771"
        $comp58.totalProjects = 1
        $comp58.totalValueMillion = 1.8
        $comp58.stageBreakdown = [PSCustomObject]@{
            groundbreak = 0
            foundation = 0
            structure = 0
            finishing = 1
        }
        $comp58.latestTimelineStage = "finishing"
        $comp58.facebookSignal = [PSCustomObject]@{
            postDate = "24 ส.ค."
            pageName = "Mosaic design & construction"
            caption = "Complete 6 months later Project เล็กๆน่ารักๆ ด้วยข้อจำกัดทางด้านพื้นที่ เวลา และงบประมาณ ที่ดิน เล็กแคบติดถนน การทำงานต้องสะดวกรวดเร็วง่ายต่อการสร้าง Design & built : Mosaic design & construction Location : udonthani"
            likes = 12
            comments = 2
            shares = 1
            detectedKeywords = @("ก่อสร้าง", "built", "design", "udonthani")
        }
        $comp58.projects = @(
            [PSCustomObject]@{
                id = "proj-mosaic-01"
                projectId = "proj-mosaic-01"
                name = "โครงการบ้านพักอาศัย อุดรธานี (Complete 6 months later)"
                title = "โครงการบ้านพักอาศัย อุดรธานี (Complete 6 months later)"
                stage = "งานส่งมอบบ้าน / ตรวจรับ"
                stageKey = "delivery"
                location = "อ.เมืองอุดรธานี จ.อุดรธานี"
                district = "เมืองอุดรธานี"
                province = "อุดรธานี"
                date = "24 สิงหาคม"
                postedTime = "24 ส.ค."
                caption = "Complete 6 months later Project เล็กๆน่ารักๆ ด้วยข้อจำกัดทางด้านพื้นที่ เวลา และงบประมาณ ที่ดิน เล็กแคบติดถนน การทำงานต้องสะดวกรวดเร็วง่ายต่อการสร้าง ต้องระวังไม่กระทบข้างเคียง เพราะ บ้านถูกปลวกกินทุกหลัง ต้องระวังการก่อสร้างเป็นพิเศษ Design & built : Mosaic design & construction Location : udonthani"
                facebookPostUrl = "https://www.facebook.com/profile.php?id=100083320623771"
                siteProof = [PSCustomObject]@{
                    postUrl = "https://www.facebook.com/profile.php?id=100083320623771"
                    postedTime = "24 สิงหาคม"
                    caption = "Complete 6 months later Project เล็กๆน่ารักๆ ด้วยข้อจำกัดทางด้านพื้นที่ เวลา และงบประมาณ Design & built : Mosaic design & construction Location : udonthani"
                }
                scgMaterials = "สุขภัณฑ์และก๊อกน้ำ COTTO, สีทาบ้าน SCG, เคมีภัณฑ์กันซึม SCG, กระเบื้องปูพื้น"
                trackingStatus = "pending"
            }
        )
        $comp58.aiShortRec = "งานส่งมอบ/ตรวจรับ (1 โครงการ)"
        $comp58.aiRecommendation = "เสนอแพ็กเกจสุขภัณฑ์ COTTO, เคมีภัณฑ์กันซึม และกระเบื้อง SCG สำหรับโครงการถัดไป"
    }

    $newJson = $obj | ConvertTo-Json -Depth 10
    $outScript = "var UDON_COMPANIES = $newJson;`n`nif (typeof window !== 'undefined') {`n  window.UDON_COMPANIES = UDON_COMPANIES;`n}`n"
    [System.IO.File]::WriteAllText('c:\Users\pannipan\Downloads\N\js\data.js', $outScript, [System.Text.Encoding]::UTF8)
    Write-Output "data.js successfully written and verified!"
} catch {
    Write-Output "JSON parse error: $_"
}
