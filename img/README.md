# Složka pro obrázky a loga

## Loga firem

Umístěte sem loga obou firem:

- `bos-pco-logo.png` nebo `bos-pco-logo.svg` - Logo BOS-PCO, s.r.o.
- `oko-logo.png` nebo `oko-logo.svg` - Logo OKO (Ing. Vojtěch Jíra)
- `combined-logo.png` nebo `combined-logo.svg` - Společné logo (volitelné)

## Jak přidat loga do webu

1. Stáhněte loga z aktuálního webu: https://www.bos-pco.cz
2. Umístěte je do této složky (`img/`)
3. Upravte HTML soubory a přidejte loga do headeru:

```html
<a href="index.html" class="logo">
    <img src="img/bos-pco-logo.png" alt="BOS-PCO" class="logo-img">
    <span class="logo-text">BOS-PCO & OKO</span>
</a>
```

Nebo pokud chcete použít pouze loga bez textu:

```html
<a href="index.html" class="logo">
    <img src="img/combined-logo.png" alt="BOS-PCO & OKO" class="logo-img">
</a>
```

## Optimalizace obrázků

Pro nejlepší výkon:
- Použijte formát WebP nebo SVG pro loga
- Optimalizujte velikost souborů
- Pro PNG/JPG použijte nástroje jako TinyPNG nebo ImageOptim
