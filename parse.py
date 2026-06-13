import re
with open(r'C:\Users\Administrator\.gemini\antigravity-cli\brain\c8df6cb2-f07a-4bc6-b0eb-ad288be30f42\.system_generated\steps\2939\content.md', encoding='utf-8') as f:
    html = f.read()

m_name = re.search(r'<span class="p-name vcard-fullname d-block overflow-hidden" itemprop="name">\s*(.*?)\s*</span>', html)
m_bio = re.search(r'<div class="p-note user-profile-bio mb-3 js-user-profile-bio f4" data-bio-text="(.*?)">', html)

print("NAME:", m_name.group(1) if m_name else "Not found")
print("BIO:", m_bio.group(1) if m_bio else "Not found")
