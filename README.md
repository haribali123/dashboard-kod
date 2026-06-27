# Supply Link Dashboard - Forráskód

Ez a repository tartalmazza a Supply Link dashboard HTML/CSS/JS forráskódját.

## Fájlok

- `index.html` - A dashboard teljes HTML struktúrája és CSS stílusai (Tailwind CSS inline)
- `app.js` - A dashboard JavaScript logikája (navigáció, webhook hívások, n8n integráció)
- `translations.js` - Fordítási fájl (többnyelvű támogatás)

## Design módosítás

A design a `index.html` fájlban található `<style>` blokkban van definiálva CSS változókkal.

### Témák

| Osztály | Leírás |
|---|---|
| `.theme-webspiring-light` | Világos téma (Supply Link türkiz, `#00A79D`) |
| `.theme-dark` | Sötét téma (kék accent) |
| `.theme-midnight-black` | Fekete téma |

### Fő CSS változók

```css
--bg-primary       /* Oldal háttérszíne */
--bg-card          /* Kártyák háttérszíne */
--border-color     /* Keret színe */
--text-main        /* Fő szövegszín */
--text-muted       /* Halványabb szövegszín */
--accent-color     /* Kiemelőszín (Supply Link: #00A79D) */
```

## n8n Webhookok

- **Termék kinyerés:** `https://n8n.webspiringsystems.com/webhook/start-upload`
- **Excel import:** `https://n8n.webspiringsystems.com/webhook/excel-import`
