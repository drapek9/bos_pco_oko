# Fotky ze zakázek

Stačí do této složky nahrát soubory:

- `zakazka-01.jpg` … `zakazka-13.jpg`

HTML na stránkách `bos-pco.html` a `oko.html` už na ně odkazuje. Pořadí a velikosti dlaždic řídí třídy `work-photo-card--a` až `--m` u jednotlivých `<article>`:

- **a** – velká dlaždice přes **2 sloupce × 2 řádky**
- **f**, **i** – široké přes **2 sloupce** (1 řádek)
- ostatní – jedna buňka

Pro jiné rozložení upravte umístění v `css/style.css` (sekce „Fotky ze zakázek“).
