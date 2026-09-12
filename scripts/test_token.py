import urllib.request
import json
import ssl

token = "apify_api_3GUGpFA4CffFy8xeDH99xx91yh4ufV035rHI"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    f"https://api.apify.com/v2/users/me?token={token}",
    headers={"User-Agent": "Antigravity/1.0"}
)

try:
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode())
        print("SUCCESS! User data:", data.get("data", {}).get("username"), data.get("data", {}).get("email"))
except Exception as e:
    print("ERROR:", e)
