#!/usr/bin/env python3
import json
import os
from pathlib import Path

# JSON dosyasını oku
with open('languages/tr/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== RESİMLİ SORULAR ANALİZİ ===\n")

resimli_sorular = data.get("Resimli Sorular", [])
print(f"Toplam resimli soru sayısı: {len(resimli_sorular)}")

print("\n=== Her sorunun detayları ===")
eksik_resimler = []
var_olan_resimler = []

for i, soru in enumerate(resimli_sorular, 1):
    print(f"\n{i}. Soru:")
    print(f"   Soru: {soru['question'][:50]}...")
    print(f"   ID: {soru['id']}")
    
    if 'imageUrl' in soru:
        image_path = soru['imageUrl']
        # assets/images/questions/ kısmını çıkar
        relative_path = image_path.replace('assets/images/questions/', '')
        full_path = f"www/assets/images/questions/{relative_path}"
        
        if os.path.exists(full_path):
            print(f"   ✅ Resim var: {relative_path}")
            var_olan_resimler.append(relative_path)
        else:
            print(f"   ❌ Resim yok: {relative_path}")
            eksik_resimler.append({
                'soru': soru['question'][:50],
                'id': soru['id'],
                'dosya': relative_path,
                'kategori': soru.get('originalCategory', 'Bilinmiyor')
            })

print(f"\n=== ÖZET ===")
print(f"Var olan resimler: {len(var_olan_resimler)}")
print(f"Eksik resimler: {len(eksik_resimler)}")

if eksik_resimler:
    print(f"\n=== EKSİK RESİMLER ===")
    for eksik in eksik_resimler:
        print(f"- {eksik['id']}: {eksik['soru']}... ({eksik['kategori']}) -> {eksik['dosya']}")
