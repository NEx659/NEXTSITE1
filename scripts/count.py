import re

with open('js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

ids = re.findall(r'"id":\s*"([^"]+)"', text)
print(f"Total Companies in js/data.js: {len(ids)}")
