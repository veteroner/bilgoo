#!/usr/bin/env python3
import json
import os
from pathlib import Path

# JSON dosyasını oku
with open('languages/tr/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== DOĞRU/YANLIŞ SORULARI ANALİZİ ===\n")

# Tüm kategorilerdeki doğru/yanlış sorularını topla
dogru_yanlis_sorular = []
resimli_kategorisindeki = []

for kategori, sorular in data.items():
    for soru in sorular:
        if soru.get('type') == 'DoğruYanlış':
            dogru_yanlis_sorular.append({
                'kategori': kategori,
                'id': soru['id'],
                'soru': soru['question'][:50] + '...',
                'resim_var': 'imageUrl' in soru or 'image' in soru
            })
            
            if kategori == "Resimli Sorular":
                resimli_kategorisindeki.append(soru)

print(f"Toplam DoğruYanlış sorusu: {len(dogru_yanlis_sorular)}")
print(f"Resimli Sorular kategorisindeki: {len(resimli_kategorisindeki)}")

# Resmi olan/olmayan sorular
resmi_olan = [s for s in dogru_yanlis_sorular if s['resim_var']]
resmi_olmayan = [s for s in dogru_yanlis_sorular if not s['resim_var']]

print(f"Resmi olan DoğruYanlış soruları: {len(resmi_olan)}")
print(f"Resmi olmayan DoğruYanlış soruları: {len(resmi_olmayan)}")

print(f"\n=== KATEGORİ DAĞILIMI ===")
kategori_sayilari = {}
for soru in dogru_yanlis_sorular:
    kategori = soru['kategori']
    if kategori not in kategori_sayilari:
        kategori_sayilari[kategori] = {'toplam': 0, 'resimli': 0}
    kategori_sayilari[kategori]['toplam'] += 1
    if soru['resim_var']:
        kategori_sayilari[kategori]['resimli'] += 1

for kategori, sayilar in sorted(kategori_sayilari.items()):
    print(f"{kategori}: {sayilar['resimli']}/{sayilar['toplam']} resimli")

print(f"\n=== RESMİ OLMAYAN İLK 10 SORU ===")
for i, soru in enumerate(resmi_olmayan[:10], 1):
    print(f"{i}. {soru['id']} ({soru['kategori']}): {soru['soru']}")

if len(resmi_olmayan) > 10:
    print(f"... ve {len(resmi_olmayan)-10} tane daha")
