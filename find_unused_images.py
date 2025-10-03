import json
import os
import re
from pathlib import Path
from collections import defaultdict

# Tüm imageUrl referanslarını topla
referenced_images = set()

# Questions.json dosyalarını bul ve oku
question_files = [
    "languages/tr/questions.json",
    "languages/en/questions.json", 
    "languages/de/questions.json"
]

for qfile in question_files:
    if os.path.exists(qfile):
        print(f"Reading {qfile}...")
        with open(qfile, 'r', encoding='utf-8') as f:
            content = f.read()
            # imageUrl değerlerini regex ile çek
            urls = re.findall(r'"imageUrl":\s*"([^"]*)"', content)
            for url in urls:
                # Sadece local asset path'leri al (http/https olanları ignore et)
                if url.startswith('assets/images/questions/'):
                    filename = url.split('/')[-1]
                    referenced_images.add(filename)

print(f"\nFound {len(referenced_images)} unique referenced images in questions.json files")

# Tüm image dosyalarını bul
images_dir = "assets/images/questions"
all_images = set()

if os.path.exists(images_dir):
    for filename in os.listdir(images_dir):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.svg', '.webp')):
            all_images.add(filename)

print(f"Found {len(all_images)} total image files in {images_dir}")

# Kullanılmayan resimleri bul
unused_images = all_images - referenced_images

print(f"\nFound {len(unused_images)} UNUSED images\n")

# Kullanılmayan resimleri sırala ve boyutlarıyla birlikte listele
unused_with_size = []
total_size = 0

for img in unused_images:
    img_path = os.path.join(images_dir, img)
    size = os.path.getsize(img_path)
    total_size += size
    unused_with_size.append((img, size))

# Boyuta göre sırala (büyükten küçüğe)
unused_with_size.sort(key=lambda x: x[1], reverse=True)

# Rapor
print("=" * 80)
print("UNUSED IMAGES REPORT")
print("=" * 80)
print(f"\nTotal unused images: {len(unused_images)}")
print(f"Total wasted space: {total_size / 1024 / 1024:.2f} MB\n")

print("Top 50 largest unused images:")
print("-" * 80)
for img, size in unused_with_size[:50]:
    print(f"{size/1024:>8.1f} KB  {img}")

# Dosyaya kaydet
with open('unused_images_report.txt', 'w', encoding='utf-8') as f:
    f.write("=" * 80 + "\n")
    f.write("UNUSED IMAGES - FULL LIST\n")
    f.write("=" * 80 + "\n")
    f.write(f"Total unused images: {len(unused_images)}\n")
    f.write(f"Total wasted space: {total_size / 1024 / 1024:.2f} MB\n\n")
    
    for img, size in unused_with_size:
        f.write(f"{size/1024:>8.1f} KB  {img}\n")
    
    f.write("\n\n" + "=" * 80 + "\n")
    f.write("DELETE COMMAND\n")
    f.write("=" * 80 + "\n")
    f.write("# To delete all unused images, run:\n")
    for img in sorted(unused_images):
        f.write(f'rm "assets/images/questions/{img}"\n')

print(f"\n\nFull report saved to: unused_images_report.txt")
print(f"\nTo delete all unused images, check the delete commands in the report file.")
