$jsonContent = [System.IO.File]::ReadAllText("c:\Users\pannipan\Downloads\N\js\data.js", [System.Text.Encoding]::UTF8)
$rawJson = $jsonContent -replace '(?s)^.*?var UDON_COMPANIES\s*=\s*', '' -replace ';\s*(if|\/\/|\Z).*$', ''
$companies = $rawJson | ConvertFrom-Json

$sku_cement1 = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4Lib4Li54LiZ4LiL4Li14LmA4Lih4LiZ4LiV4LmM4LmE4Liu4LiU4Lij4Lit4Lil4Li04LiBIFNDRyDguguLluLmguYLguITguKPguIfguKrguKPguYnguLLguIc="))
$sku_cpac1 = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4LiE4Lit4LiZ4LiB4Lij4Li14LiV4Lic4Liq4Lih4LmA4Liq4Lij4LmH4LiIIENPQUMgU3VwZXIgUGx1cyAyNDAga3Nj"))
$sku_cpac2 = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4LiE4Lit4LiZ4LiB4Lij4Li14LiV4Lic4Liq4Lih4LmA4Liq4Lij4LmH4LiIIENPQUMgMjQwIGtzYw=="))
$sku_cement2 = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4Lib4Li54LiZ4LiL4Li14LmA4Lih4LiZ4LiV4LmM4LmE4Liu4LiU4Lij4Lit4Lil4Li04LiBIFNDRyDguguLluLluJLguLLguJnguKPguLLguIE="))
$sku_roof = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4LiB4Lij4Liw4LmA4Lia4Li34Lit4LiH4Lir4Lil4Lix4LiHIElDRyBOZXVUaWxlL1ByZXN0aWdl"))
$sku_tiger = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4Lib4Li54LiZ4LmA4Liq4Li34Lit4Lih4Lit4Lij4LmM4LiV4Liy4LijIOC4guLluLluIHguYjgureguguLiy4Lia"))
$sku_dcor1 = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4LmE4Lih4LmJ4Liq4Lix4LiH4LmA4LiE4Lij4Liy4LiwIFNDRyBELUNPUiAmIOC4quC4oeC4suC4o+C5jOC4lOC4muC4reC4o+C5jOC4lQ=="))
$sku_cement3 = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4Lib4Li54LiZ4LiL4Li14LmA4Lih4LiZ4LiV4LmM4LmE4Liu4LiU4Lij4Lit4Lil4Li04LiBIFNDRyDguguLluLluYDguKrguLLguITguLLguJk="))
$sku_qcon = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4Lit4Li04LiQ4Lih4Lin4Lil4LmA4Lia4LiyIFEtQ09OIOC4guC4meC4suC4lCA3LjUg4LiL4LihLg=="))
$sku_tiger2 = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4Lib4Li54LiZ4LmA4Liq4Li34Lit4Lih4Lit4Lij4LmM4LiV4Liy4LijIOC4guLluLluguLiy4Lia4Lil4Liw4LmA4Lit4Li14Lii4LiU"))
$sku_dcor2 = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4LmE4Lih4LmJ4Liq4Lix4LiH4LmA4LiE4Lij4Liy4LiwIFNDRyBELUNPUiDguJXguIEguYHguJXguYjguIfguJnguLLguJTguJnguLLguKc="))
$sku_cotto = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("4Liq4Li44LiC4Lig4Lix4LiT4LiR45C54LmB4Lil4Liw4LiB4Lij4Liw4LmA4Lia4Li34Lit4LiH4Lib4Li54LiZ4Lie4Li34LmJ4LiZIENPVFRPIChTYW5pdGFyeXdhcmUp"))

foreach ($c in $companies) {
  foreach ($p in $c.projects) {
    if ($p.stageKey -eq 'groundbreak') {
      $p.boqMaterials = @(
        [ordered]@{ sku = "ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง"; qty = "500 ถุง"; estCost = "฿85,000"; urgency = "ด่วนที่สุด" },
        [ordered]@{ sku = "คอนกรีตผสมเสร็จ CPAC Super Plus 240 ksc"; qty = "35 คิว"; estCost = "฿77,000"; urgency = "ด่วนที่สุด" }
      )
    } elseif ($p.stageKey -eq 'foundation') {
      $p.boqMaterials = @(
        [ordered]@{ sku = "คอนกรีตผสมเสร็จ CPAC 240 ksc"; qty = "65 คิว"; estCost = "฿143,000"; urgency = "กำลังใช้งาน" },
        [ordered]@{ sku = "ปูนซีเมนต์ไฮดรอลิก SCG งานฐานราก"; qty = "350 ถุง"; estCost = "฿59,500"; urgency = "เตรียมสั่งซื้อ" }
      )
    } elseif ($p.stageKey -eq 'structure') {
      $p.boqMaterials = @(
        [ordered]@{ sku = "กระเบื้องหลังคา SCG NeuTile/Prestige"; qty = "220 ตร.ม."; estCost = "฿154,000"; urgency = "ด่วนที่สุด" },
        [ordered]@{ sku = "ปูนเสือมอร์ตาร์ งานก่อฉาบ"; qty = "250 ถุง"; estCost = "฿35,000"; urgency = "เตรียมสั่งซื้อ" },
        [ordered]@{ sku = "ไม้สังเคราะห์ SCG D-COR & สมาร์ทบอร์ด"; qty = "120 ตร.ม."; estCost = "฿48,000"; urgency = "วางสเปก" },
        [ordered]@{ sku = "ปูนซีเมนต์ไฮดรอลิก SCG งานเสาคาน"; qty = "200 ถุง"; estCost = "฿34,000"; urgency = "กำลังใช้งาน" }
      )
    } elseif ($p.stageKey -eq 'finishing') {
      $p.boqMaterials = @(
        [ordered]@{ sku = "อิฐมวลเบา Q-CON ขนาด 7.5 ซม."; qty = "2,200 ก้อน"; estCost = "฿48,400"; urgency = "เตรียมสั่งซื้อ" },
        [ordered]@{ sku = "ปูนเสือมอร์ตาร์ งานฉาบละเอียด"; qty = "300 ถุง"; estCost = "฿36,000"; urgency = "เตรียมสั่งซื้อ" },
        [ordered]@{ sku = "ไม้สังเคราะห์ SCG D-COR ตกแต่งฟาซาด"; qty = "100 ตร.ม."; estCost = "฿45,000"; urgency = "เตรียมสั่งซื้อ" },
        [ordered]@{ sku = "สุขภัณฑ์และกระเบื้องปูพื้น COTTO"; qty = "4 ชุด / 150 ตร.ม."; estCost = "฿95,000"; urgency = "เตรียมส่งมอบ" }
      )
    }
  }
}

$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";" + [Environment]::NewLine + "if (typeof window !== 'undefined') { window.UDON_COMPANIES = UDON_COMPANIES; }"

[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\js\data.js", $finalJs, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\data.js", $finalJs, [System.Text.Encoding]::UTF8)

# Inject into index.html and NEX SAKON.html
$html = [System.IO.File]::ReadAllText("c:\Users\pannipan\Downloads\N\index.html", [System.Text.Encoding]::UTF8)
$injection = "    <!-- Embedded Full 64 Projects Master Dataset -->" + [Environment]::NewLine + "    <script>" + [Environment]::NewLine + $finalJs + [Environment]::NewLine + "    </script>" + [Environment]::NewLine + "    <!-- App JS modules -->" + [Environment]::NewLine + '    <script src="js/scoring.js"></script>' + [Environment]::NewLine + '    <script src="js/charts.js"></script>' + [Environment]::NewLine + '    <script src="js/map.js"></script>' + [Environment]::NewLine + '    <script src="js/app.js"></script>'

$targetPattern = '(?s)<!-- Embedded Full 64 Projects Master Dataset -->.*?<script src="js/app\.js"></script>'
if ($html -notmatch $targetPattern) {
  $targetPattern = '(?s)<!-- App JS modules -->.*?<script src="js/app\.js"></script>'
}
$newHtml = [regex]::Replace($html, $targetPattern, $injection)

[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\index.html", $newHtml, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\NEX SAKON.html", $newHtml, [System.Text.Encoding]::UTF8)

Write-Host "ALL_COMPLETED_PERFECTLY"
