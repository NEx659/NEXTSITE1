$html = @"
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
<script src="../js/data.js"></script>
<script src="../js/app.js"></script>
<script>
window.onload = function() {
  console.log("Testing COMPANY_MAPS_MASTER and UDON_COMPANIES length: " + UDON_COMPANIES.length);
  let mismatches = [];
  UDON_COMPANIES.forEach((c, i) => {
    let expected = COMPANY_MAPS_MASTER[c.id];
    let actual = c.googleMapsUrl;
    if (expected !== actual) {
      mismatches.push({ id: c.id, name: c.name, expected: expected, actual: actual });
    }
  });

  if (mismatches.length === 0) {
    document.body.innerHTML = "<h1 style='color:green;'>SUCCESS: 100% MATCH FOR ALL " + UDON_COMPANIES.length + " COMPANIES</h1>";
  } else {
    document.body.innerHTML = "<h1 style='color:red;'>MISMATCHES: " + JSON.stringify(mismatches) + "</h1>";
  }
};
</script>
</body>
</html>
"@

[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\scratch\test_maps_match.html", $html, [System.Text.Encoding]::UTF8)
Write-Host "Created test_maps_match.html"
