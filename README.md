# Muší hnízdo

Jednoduchá webová hra pro dvě hráčky na jedné klávesnici (čtyřletá a osmiletá sestra).

## Koncept

Dvě místnosti vedle sebe, jeden dům. Mouchy vylétávají ze společného hnízda nahoře
uprostřed a dávkovač je posílá tam, kde je zrovna volno — kdo plácá rychle, dostává
mouchy častěji, kdo má mouchu pořád aktivní, čeká. Tím se obtížnost mezi sestrami
samo vyvažuje, bez explicitního nastavování.

- **Levá strana (4 roky):** 1 klávesa (mezerník), čisté časování — plácni, když je
  moucha v zóně.
- **Pravá strana (8 let):** 2 klávesy — plácnutí na mouchu, "nehýbej se" na
  včelu/berušku, kterou se plácat nesmí.

Kolo trvá 60 vteřin. Na konci žádné srovnávání skóre mezi sestrami — jen společná
oslava podle celkového počtu chycených much.

## Ovládání

| Strana | Akce           | Klávesa     |
|--------|----------------|-------------|
| Levá   | Plácnout       | Mezerník    |
| Pravá  | Plácnout       | ←           |
| Pravá  | Nehýbat se     | →           |

## Spuštění

Statická stránka, žádný build krok — stačí otevřít `index.html` v prohlížeči
(nebo spustit přes lokální server kvůli ES modulům, např. `npx serve`).
