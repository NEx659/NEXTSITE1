$posts = Get-Content 'scripts/facebook_54_pages_posts.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$mindPosts = $posts | Where-Object { 
    $_.facebookUrl -like "*MindHome.Grand*" -or 
    $_.url -like "*MindHome.Grand*" -or 
    $_.inputUrl -like "*MindHome.Grand*" -or 
    $_.pageName -eq "MindHome.Grand"
}

Write-Host "Evaluating MindHome.Grand posts ($($mindPosts.Count) posts):"

$marketingCatalogPatterns = @(
  'เริ่มต้นเพียง', 'ราคาเริ่มต้น', 'โปรโมชั่นพิเศษ', 'แถมฟรีเสาเข็ม',
  'ปรึกษาฟรี', 'จองวันนี้', 'รับส่วนลด', 'แจกฟรี', 'ผ่อนเริ่มต้น', 'กู้ได้เต็ม',
  'แบบบ้านยอดนิยม', 'แบบบ้านแนะนำ', 'แบบบ้านขายดี',
  'พร้อมให้คุณเป็นเจ้าของ', 'แพ็กเกจสร้างบ้าน', 'จองโปรโมชั่น', 'แบบบ้าน modern',
  '3d', 'perspective', 'ภาพ 3d', 'ภาพสามมิติ', 'ภาพจำลอง', 'ภาพเสมือนจริง',
  'วางแผนทิศบ้าน', 'ก่อนสร้างบ้าน', 'ทิศแดด', 'ทิศลม', 'ผลงานสร้างเสร็จจริงกว่า', 'ผลงานคุณภาพมากกว่า'
)

$verifiedCustomerSignals = @(
  'บ้านคุณ', 'ของ คุณ', 'ของคุณ', 'ลูกค้าคุณ', 'owner :', 'owner:', 'owner', 'เจ้าของบ้าน',
  'พิธียกเสาเอก', 'พิธีลงเสาเอก', 'ยกเสาเอก', 'ยกเสาโท',
  'ส่งมอบบ้านคุณ', 'ส่งมอบงานคุณ', 'พิธีมอบกุญแจ'
)

$realSiteEvidence = @(
  'อัพเดทหน้างาน', 'อัปเดตหน้างาน', 'site update', 'update หน้างาน',
  'อัปเดตความคืบหน้า', 'อัพเดทความคืบหน้า', 'รายงานความคืบหน้า',
  'อัพเดทงาน', 'อัปเดตงาน', 'update งาน', 'รายงานหน้างาน', 'เข้าตรวจหน้างาน', 'เข้าตรวจไซต์งาน',
  'จบหน้างาน', 'จบงาน', 'ปิดหน้างาน', 'ส่งมอบบ้าน', 'ตรวจรับบ้าน',
  'ชมผลงานจริง', 'ผลงานจริง', 'อีกผลงาน', 'อีกหนึ่งผลงาน',
  '📌site', '📌หน้างาน', 'site :', 'site:', 'หน้างาน :', 'หน้างาน:', 'พิกัดหน้างาน', 'งบก่อสร้าง',
  'เทคอนกรีต', 'เทพื้น', 'เทปูน', 'คานคอดิน', 'ผูกเหล็ก', 'ฉาบผนัง', 'งานฉาบ', 'ฉาบปูน', 'ก่ออิฐ',
  'งานฝ้า', 'ฝ้าเพดาน', 'ฝ้าหลุม', 'ฝ้าฉาบเรียบ', 'ปูกระเบื้อง', 'งานปูกระเบื้อง', 'มุงหลังคา', 'ทาสี', 'งานสี', 'ติดตั้ง builtin'
)

$i = 1
foreach ($p in $mindPosts) {
    $t = $p.text.ToLower()
    $isAd = $false
    foreach ($m in $marketingCatalogPatterns) { if ($t.Contains($m)) { $isAd = $true; break } }
    $hasCust = $false
    foreach ($c in $verifiedCustomerSignals) { if ($t.Contains($c)) { $hasCust = $true; break } }
    $hasSite = $false
    foreach ($s in $realSiteEvidence) { if ($t.Contains($s)) { $hasSite = $true; break } }
    
    $hasUdon = $t.Contains("อุดร") -or $t.Contains("เมือง")
    $hasSakon = $t.Contains("สกล") -or $t.Contains("สว่างแดนดิน")
    $hasKhon = $t.Contains("ขอนแก่น")
    
    Write-Host "`n[$i] URL: $($p.url)"
    Write-Host "    isAd: $isAd | hasCust: $hasCust | hasSite: $hasSite"
    Write-Host "    Udon: $hasUdon | Sakon: $hasSakon | Khon: $hasKhon"
    $i++
}
