import json
import re

with open("js/data.js", "r", encoding="utf-8") as f:
    text = f.read()

# remove `var UDON_COMPANIES = ` and trailing `;`
text = re.sub(r'^\s*var\s+UDON_COMPANIES\s*=\s*', '', text)
text = re.sub(r';\s*$', '', text)

data = json.loads(text)

print(f"Total companies in data.js: {len(data)}")

prov_map = {}
non_udon = []

for c in data:
    prov = c.get("province", "UNKNOWN")
    prov_map[prov] = prov_map.get(prov, 0) + 1
    if prov != "อุดรธานี":
        non_udon.append(c)

print("=== Province Breakdown ===")
for p, count in prov_map.items():
    print(f"{p}: {count} companies")

print("\n=== Companies NOT in อุดรธานี ===")
for c in non_udon:
    print(f"ID: {c.get('id')} | Name: {c.get('name')} | Province: {c.get('province')} | District: {c.get('district')}")
