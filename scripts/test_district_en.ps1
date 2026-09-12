$sampleTexts = @(
    "Location : Mueang Udon Thani ลูกค้าคุณบอย",
    "location: Kumphawapi จ.อุดรธานี",
    "PROGRESS UPDATE Contemporary House พิกัด ต.บ้านจั่น จ.อุดรธานี",
    "📍 งานมุงหลังคา 📍 บ้านคุณบีม พิกัด อ.นายูง จ.อุดรธานี",
    "ไซต์งาน อ.เกษตรวิสัย จ.ร้อยเอ็ด"
)

Write-Host "Testing District Pattern Matcher:"
foreach ($txt in $sampleTexts) {
    $t = $txt.ToLower()
    $isOther = ($t -match 'ร้อยเอ็ด|ขอนแก่น|เลย')
    $isUdonEn = ($t -match 'mueang udon thani|kumphawapi|nong han|ban dung|phen|kut chap|na yung')
    $isUdonTh = ($t -match 'เมืองอุดรธานี|กุมภวาปี|หนองหาน|บ้านดุง|เพ็ญ|กุดจับ|นายูง|บ้านจั่น|หนองขอนกว้าง')
    
    $accepted = (!$isOther) -and ($isUdonEn -or $isUdonTh)
    Write-Host "Text: '$txt' -> Accepted: $accepted"
}
