$raw = Get-Content -Raw -Encoding UTF8 ./js/data.js
$idx = $raw.IndexOf('[')
$json = $raw.Substring($idx)
$companies = ConvertFrom-Json $json

$mapData = @(
    @{ name = "อภิญญา ก่อสร้าง Apinya Construction"; url = "https://maps.app.goo.gl/akUxDHyGEwG19reH8" },
    @{ name = "ห้างหุ้นส่วนจำกัด ฟู่เฮ้าส์ อินทีเรีย ดีไซน์ FU House Interior Design"; url = "https://maps.app.goo.gl/Vu7M4NUqxycvShmn9" },
    @{ name = "หจก.บ้านรักษ์อุดรธานี"; url = "https://maps.app.goo.gl/FZn8CZd8TZEupkLW9" },
    @{ name = "บริษัทกิตติศักดิ์การก่อสร้าง แอนด์ดีไซน์ สาขาอุดรธานี (ออฟฟิศบ้านสวน)"; url = "https://maps.app.goo.gl/1KYvUz75czBcHm8v5" },
    @{ name = "บ้านวิศวะ คอนสตรัคชั่น / Baanwisawa Construction Ltd.,PART"; url = "https://maps.app.goo.gl/XyrAGFjdebLLkp5q9" },
    @{ name = "บริษัท การิน บ้านสวย จำกัด (Karin Bansuay)"; url = "https://maps.app.goo.gl/7z72u7gtyswCyU6o6" },
    @{ name = "บริษัท อ.เจริญก่อสร้าง คอนสตรัคชั่น จำกัด"; url = "https://maps.app.goo.gl/q2HdGPacB4MeHS8d6" },
    @{ name = "บ้านทุ่งพี่ณิชา&น้องณัชชา"; url = "https://maps.app.goo.gl/RACSBs46UeBzcEmKA" },
    @{ name = "บริษัท แพลน-ดี คอนสตรัคชั่น จำกัด"; url = "https://maps.app.goo.gl/NSJJDZPRKru1owkr7" },
    @{ name = "บริษัท บ้านใหญ่ (2016) โฮม บิวเดอร์ จำกัด BAANYAI(2016)"; url = "https://maps.app.goo.gl/xhY5ipfir6RTRXLR9" },
    @{ name = "ห้างหุ้นส่วนจำกัด พีเอ แอนด์ ทีเอ็น"; url = "https://maps.app.goo.gl/EJb3h9y7jTe4JMiJ7" },
    @{ name = "บริษัท ป. รุ่งเรือง พีเอสพีเอส จำกัด"; url = "https://maps.app.goo.gl/YGKZB6pezKPSYnMb6" },
    @{ name = "ห้างหุ้นส่วนจำกัด เอสวาย.เฮาส์ ดีไซน์ แอนด์ คอนสตรัคชั่น"; url = "https://maps.app.goo.gl/Lk82k26BAtuWnUC8A" },
    @{ name = "IDYLLIC Construction"; url = "https://maps.app.goo.gl/ZrCewx5vJA86nzjXA" },
    @{ name = "ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง"; url = "https://maps.app.goo.gl/5ovdiUtuVGVLiR5X8" },
    @{ name = "บริษัท เปเป้ คอนกรีต จำกัด Pepe Concrete Ltd."; url = "https://maps.app.goo.gl/bL7RqF7sHMSfYYzR6" },
    @{ name = "ห้างหุ้นส่วนจำกัด ปิยภัทร125 คอนสตรัคชั่น"; url = "https://maps.app.goo.gl/6TVPLFqkx5AYSZo17" },
    @{ name = "CIVIL PRO – ENGINEERING | CONSTRUCTION"; url = "https://maps.app.goo.gl/5jEQcsqDhYCNDPyM9" },
    @{ name = "รับสร้างบ้าน INT Design"; url = "https://maps.app.goo.gl/CJnV3h68YzfEJkHx9" },
    @{ name = "บริษัท เอ-เฮ้าส์ บิวเดอร์ จำกัด"; url = "https://maps.app.goo.gl/VtnWrKj3HnsiaX9C6" },
    @{ name = "บริษัท มารีญาก่อสร้าง จำกัด"; url = "https://maps.app.goo.gl/fBRFeUPfffZhQcPK7" },
    @{ name = "ซีที การก่อสร้าง"; url = "https://maps.app.goo.gl/44eCAxmwPMNrigGx5" },
    @{ name = "ห้างหุ้นส่วนจำกัด หล้าก่ำ ทรัพย์เจริญยิ่ง"; url = "https://maps.app.goo.gl/NirnCDaBB2bk9fH98" },
    @{ name = "ห้างหุ้นส่วนจำกัด จีรนันท์ พร็อพเพอร์ตี้"; address = "14 หมู่ที่ 12 ตำบลไชยวาน อำเภอไชยวาน จ.อุดรธานี 41290" },
    @{ name = "ห้างหุ้นส่วนจำกัด วันเดอร์ครีเอชั่น"; url = "https://maps.app.goo.gl/nMzQ5MA5Jn4h5qdXA" },
    @{ name = "บริษัท พีรพัฒน์ 999 บิวล์ดิ้ง แอนด์ เซอร์วิสเฮ้าส์ จำกัด"; address = "Amphoe Ban Dung, Thailand, 41190" },
    @{ name = "ห้างหุ้นส่วนจำกัด ฟ้าสว่างการโยธา"; address = "104 หมู่บ้าน หนองบึงมอ หมู่ที่ 4 ตำบลเชียงเพ็ง อำเภอกุดจับ จ.อุดรธานี 41250" },
    @{ name = "ห้างหุ้นส่วนจำกัด บ้านดี-อุดร"; address = "447 หมู่ที่ 7 ตำบลหมูม่น อำเภอเมืองอุดรธานี จังหวัดอุดรธานี, Udon Thani, Thailand, 41000" },
    @{ name = "บริษัท นิติพันธ์เฮ้าส์ ยูดี จำกัด"; address = "702 หมู่ 2 สามพร้าว, Udon Thani, Thailand, 41000" },
    @{ name = "บริษัท ช.รุ่งอรุณ คอนสตรัคชั่น จำกัด"; url = "https://maps.app.goo.gl/JSuoMGZYTfQER3ZQ9" },
    @{ name = "รุ่งรัตน์บิวตี้โฮม รับเหมาสร้างบ้าน"; address = "75หมู่2 ต.โนนสะอาด อำเภอโนนสะอาด จังหวัดอุดรธานี, Udon Thani, Thailand, 41240" },
    @{ name = "ห้างหุ้นส่วนจำกัด บ้านดี อยู่ดี ดีไซน์"; url = "https://maps.app.goo.gl/eovsgPjYBYryDXgo8" }
)

Write-Host "Total companies in dataset: $($companies.Count)"
Write-Host "Total items provided: $($mapData.Count)"

foreach ($item in $mapData) {
    $matched = $false
    $itemName = $item.name.Trim()
    
    # Try exact or partial match
    foreach ($c in $companies) {
        $cName = $c.name.Trim()
        $cEng = if ($c.engName) { $c.engName.Trim() } else { "" }
        
        $cleanItem = $itemName -replace 'บริษัท|จำกัด|ห้างหุ้นส่วน|หจก\.|หจก|\s+', ''
        $cleanC = $cName -replace 'บริษัท|จำกัด|ห้างหุ้นส่วน|หจก\.|หจก|\s+', ''
        
        if ($cName.Contains($itemName) -or $itemName.Contains($cName) -or $cleanItem.Contains($cleanC) -or $cleanC.Contains($cleanItem)) {
            Write-Host "MATCHED: '$itemName' => '$cName' (ID: $($c.id))"
            $matched = $true
            break
        }
    }
    
    if (-not $matched) {
        Write-Host "NOT MATCHED: '$itemName'" -ForegroundColor Yellow
    }
}
