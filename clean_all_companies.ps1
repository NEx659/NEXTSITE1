# Robust Base64 UTF-8 fixer for all 58 companies

function From-B64($str) {
    return [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($str))
}

$content = [System.IO.File]::ReadAllText("$pwd/js/data.js", [System.Text.Encoding]::UTF8)
$jsonStr = $content.Substring($content.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$companies = $jsonStr | ConvertFrom-Json

Write-Host "Loaded $($companies.Count) companies"

# "อุดรธานี"
$udonProv = From-B64 "4Lit4Li44LiU4Lij4LiY4Liy4LiZ4Li1"
# "เมืองอุดรธานี"
$udonDist = From-B64 "4LmA4Lih4Li34Lit4LiH4Lit4Li44LiU4Lij4LiY4Liy4LiZ4Li1"
# "หนองวัวซอ"
$nongWuaSoDist = From-B64 "4Lir4LiZ4Lit4LiH4Lin4Lix4Lin4Lio4Lit"

foreach ($c in $companies) {
    # Ensure all companies have clean "อุดรธานี"
    $c.province = $udonProv
    if (-not $c.district -or $c.district.Length -gt 20 -or $c.district -match 'เธ') {
        $c.district = $udonDist
    }

    # Fix comp-udon-58: ห้างหุ้นส่วนจำกัด โมเสคดีไซน์ แอนด์ คอนสตรัคชั่น
    if ($c.id -eq 'comp-udon-58') {
        $c.name = From-B64 "4Lir4LmJ4Liy4LiH4Lir4Li44LmJ4LiZ4Liq4LmI4Lin4LiZ4LiI4Liz4LiB4Lix4LiUIOC5guC4oeC5gOC4quC4hOC4lOC4teC4iOC4meC5jCDguYHguK3guJnguJTguYwg4LiE4Lit4LiZ4Liq4LiV4Lij4Lix4LiE4Liu4Lix4LmI4LiZ"
        $c.category = From-B64 "4Lij4Lix4Lia4Liq4Lij4LmJ4Liy4LiH4Lia4LmJ4Liy4LiZ4LmA4Lil4Liw4LiH4Liy4LiZ4LiB4LmI4Lit4Liq4Lij4LmJ4Liy4LiH4LiE4Lij4Lia4Lin4LiH4LiI4Lij (TSIC 41001)"
        $c.address = From-B64 "4LmA4Lih4Li34Lit4LiH4Lit4Li44LiU4Lij4LiY4Liy4LiZ4Li1IOC4iS7guK3guLjguJTguKPguJjguLLguJnguLU="
        $c.contactPerson = $c.name
        $c.revenuePotentialText = "฿1.5M"
    }

    # Fix comp-udon-41: บริษัท มารีญาก่อสร้าง จำกัด
    if ($c.id -eq 'comp-udon-41') {
        $c.name = From-B64 "4Lia4Lij4Li04Lip4Lix4LiXIOC4oeC4suC4o-C4teC4jeC4suC4geC5iOC4reC4quC4o-C5ieC4suC4hyDguIjguLPguIHguLHguJQ="
        $c.category = From-B64 "4Lij4Lix4Lia4Liq4Lij4LmJ4Liy4LiH4Lia4LmJ4Liy4LiZ4LmA4Lil4Liw4LiH4Liy4LiZ4Liq4LiW4Liy4Lib4Lix4LiV4Lii4LiB4Lij4Lij4Lih4Lij4Liw4LiU4Lix4Lia4LiX4Lij4Li14LmA4Lih4Li14Lii4Lih (TSIC 41001)"
        $c.address = From-B64 "4LitLuC5gOC4oeC4t-C4reC4h-C4reC4uOC4lOC4o-C4mOC4suC4meC4tSDguIku4Lit4Li44LiU4Lij4LiY4Liy4LiZ4Li1"
        $c.contactPerson = From-B64 "4LiE4Li44LiT4Lih4Liy4Lij4Li14LiN4LiyIC8g4Lif4LmI4Liy4Lii4LmA4Lib4Lij4Liw4Liq4Liy4LiZ4LiH4Liy4LiZ4LmC4LiE4Lij4LiH4LiB4Liy4LijIChMaW5lOiBAbWFyaWFjb25zLWFkbWluKQ=="
        $c.revenuePotentialText = "฿1.8M"
    }

    # Fix comp-udon-21: ห้างหุ้นส่วนจำกัด คิดดีเฮาส์คอนสทรัคชั่น
    if ($c.id -eq 'comp-udon-21') {
        $c.name = From-B64 "4Lir4LmJ4Liy4LiH4Lir4Li44LmJ4LiZ4Liq4LmI4Lin4LiZ4LiI4Liz4LiB4Lix4LiUIOC4hOC4tOC4lOC4lOC4teC5gOC4h-C4suC4quC5gOC4hOC4reC4meC4quC4leC4o-C4seC4hOC4p-C4iOC4seC5iOC4mQ=="
        $c.category = From-B64 "4Lij4Lix4Lia4LmA4Lir4Lih4LiB4LmI4Lit4Liq4Lij4LmJ4Liy4LiHIOC4reC4reC4geC5geC4muC4myDguYHguKXguLDguKPguLXguYLguJnguYDguKfguJfguK3guLiy4LiE4Liy4Lij (TSIC 41001)"
        $c.district = $nongWuaSoDist
        $c.address = From-B64 "4LitLuC4q-C4meC4reC4h-C4p-C4seC4p-C4i-C4rSAvIOC4rS7guYDguKHguLfguK3guIfguK3guLjguJTguKPguJjguLLguJnguLUg4LiJL蒂4Lit4Li44LiU4Lij4LiY4Liy4LiZ4Li1"
        # Let's cleanly set address using clean Base64
        $c.address = From-B64 "4LitLuC4q-C4meC4reC4h-C4p-C4seC4p-C4i-C4rSAvIOC4rS7guYDguKHguLfguK3guIfguK3guLjguJTguKPguJjguLLguJnguLUg4LiJL蒂4Lit4Li44LiU4Lij4LiY4Liy4LiZ4Li1"
        $c.address = From-B64 "4LitLuC4q-C4meC4reC4h-C4p-C4seC4p-C4i-C4rSAvIOC4rS7guYDguKHguLfguK3guIfguK3guLjguJTguKPguJjguLLguJnguLUg4LiJLg==" + $udonProv
        $c.contactPerson = From-B64 "4Lif4LmI4Liy4Lii4LmA4Lib4Lij4Liw4Liq4Liy4LiZ4LiH4Liy4LiZIOC4q-C4iOC4gS7guITguLTguJTguJTguLXguYDguIfguLLguKrguYDguITguK3guJnguKrguJXguKPguLHguITguKfguIjguLHguYjguJkgKExpbmU6IEFyY2h0aWdlciAvIDA4OC01NjMtNjU4Nyk="
        $c.revenuePotentialText = "฿0.8M"
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$newJson = $companies | ConvertTo-Json -Depth 10
$finalJs = "var UDON_COMPANIES = " + $newJson + ";"

[System.IO.File]::WriteAllText("$pwd/js/data.js", $finalJs, $utf8NoBom)
Write-Host "Successfully updated js/data.js with clean UTF-8!"
