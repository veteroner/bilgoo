#!/usr/bin/env python3
import json
import os
from pathlib import Path

# JSON dosyasını oku
with open('languages/tr/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== RESMİ OLMAYAN DOĞRU/YANLIŞ SORULARI ===\n")

# Resmi olmayan sorular
resmi_olmayan = []
for kategori, sorular in data.items():
    for soru in sorular:
        if soru.get('type') == 'DoğruYanlış' and 'imageUrl' not in soru and 'image' not in soru:
            resmi_olmayan.append({
                'kategori': kategori,
                'id': soru['id'],
                'soru': soru['question'],
                'cevap': soru['correctAnswer']
            })

for i, soru in enumerate(resmi_olmayan, 1):
    print(f"{i}. {soru['id']} ({soru['kategori']})")
    print(f"   Soru: {soru['soru']}")
    print(f"   Cevap: {soru['cevap']}")
    print()

print(f"Toplam resmi olmayan soru: {len(resmi_olmayan)}")
