# yesend-web

Web fantasy klubu **Yes&** — MTG a D&D klub Jeseník. `https://yesendklub.cz`

Statický web (HTML/CSS/JS) **bez build procesu** — soubory se nahrávají tak, jak
jsou. Hostováno na Firebase Hosting. Nahradil starý web na Wixu.

---

## Struktura

```
index.html                 domovská („Kdy a kde“) + O nás + Kontakt jako kotvy
mtg-jesenik.html           Magic: The Gathering
dnd-jesenik.html           Dungeons & Dragons
warhammer-jesenik.html     Warhammer 40k Kill Team
serm-jesenik.html          LARP a šerm (HEMA – dlouhý meč)
caste-dotazy.html          FAQ, 19 otázek
404.html                   chybová stránka

style.css                  jediný stylopis, mobile-first, breakpoint 900 px
script.js                  mobilní menu, hlavička, kotvy, videa, formulář
cookie-consent.js          souhlas s cookies — teprve po něm se načte GA4
images/                    43 souborů, 4,9 MB

firebase.json              hosting: cleanUrls, cache hlavičky, ignore
robots.txt, sitemap.xml    pro vyhledávače
```

## Účty a služby

| Co | Kde | Poznámka |
|---|---|---|
| Hosting | Firebase, projekt `yesend-web` | plán **Spark** (zdarma), lokace Czechia, Google Analytics zapnuté |
| Repozitář | GitHub `fangorzjeseniku/yesend-web` | veřejný |
| Doména | `yesendklub.cz`, registrátor VEDOS | bez hostingu, jen doména + DNS |
| Formulář | Web3Forms, free plán 250 zpráv/měsíc | access key je v `script.js` (je veřejný záměrně) |
| Analytika | Google Analytics 4, property `yesend-web` | measurement ID `G-2XNE1XJPR0`, načte se jen po souhlasu s cookies (viz níže) |
| Vyhledávače | Google Search Console, doména `yesendklub.cz` | ověřeno přes DNS TXT, `sitemap.xml` odeslaný |

**Dvě e-mailové adresy, každá schválně jinam:**

- přihlášky z formuláře → `fangorzjeseniku@gmail.com`
- veřejný kontakt v patičce a v JSON-LD → `jakub.kovarik.c@gmail.com`
  (působí navenek profesionálněji)

**Telefon na webu záměrně není** a není zapsaný ani tady — README je ve veřejném
repozitáři.

## Starý web

`https://yesend.wixsite.com/mtg-dnd` — pořád běží a vedou na něj zpětné odkazy.
Po nasazení nového webu se má zredukovat na rozcestník s proklikem, ne smazat
(odkazy by se rozbily).

Slugy se změnily: starý web měl pro Warhammer `w40k`, nový má
`warhammer-jesenik`. `larp-serm-jesenik` bylo zkráceno na `serm-jesenik` —
šerm je hlavní aktivita, LARP doplňková.

Odkazy na partnery jsou aktualizované na jejich nové weby
(`emkojesenik.cz`, `cernyrytir.cz`) — starší podklady uváděly jiné adresy.

## Lokální náhled

Ve VS Code s rozšířením **Live Server**: pravý klik na `index.html` →
*Open with Live Server*. Běží na `http://127.0.0.1:5500`.

**Vždy přes `http://`, nikdy dvojklikem na soubor (`file://`).** Přes `file://`
je origin „null" a YouTube embedy hlásí „Chyba 153" — vypadá to jako rozbitá
videa, ale je to jen artefakt.

## Nasazení

```bash
firebase login
firebase deploy
```

`firebase.json` už obsahuje `public: "."` a `cleanUrls: true`, takže
`firebase init hosting` se znovu nespouští.

`cleanUrls` znamená, že veřejné adresy jsou bez `.html`
(`yesendklub.cz/caste-dotazy`). **Vnitřní odkazy v HTML se ale píšou s `.html`** —
Firebase je přesměruje. Kanonické URL v `<head>` jsou naopak bez přípony.

---

## Design systém

Všechny hodnoty jsou v `style.css` na začátku jako CSS proměnné (`:root`).
Změna na jednom místě se propíše do celého webu.

### Barvy

| Proměnná | Hodnota | Použití |
|---|---|---|
| `--bg-dark` | `#2e2e2e` | pozadí celého webu |
| `--text-light` | `#edebe8` | text (teplá bílá, ne čistě `#fff`) |
| `--accent` | `#e4580b` | **jediná oranžová** — tlačítka, odkazy, favicon |
| `--card-light` | `#f7f7f7` | karta pod logy partnerů |
| `--ink` | `#1c1c1c` | text na bílé kartě (formulář) |

Brand manuál původně uváděl jinou oranžovou a modrou. Sjednoceno na barvy
z webu — modrá se nakonec nikde nepoužívá.

### Šířky

| Proměnná | Hodnota | Použití |
|---|---|---|
| `--measure` | 700 px | obsahový sloupec (ideální délka řádku) |
| `--measure-narrow` | 500 px | úzké bloky |
| `--wide` | 1180 px | patička, galerie, hero |
| `--gutter` | `clamp(20px, 6vw, 64px)` | boční odsazení |

### Mezery — nejdůležitější pravidlo v celém CSS

```css
--space-tight: 24px;
--space-default: 50px;
--space-section: clamp(64px, 11vw, 160px);   /* mobil 64, desktop až 160 */
```

**Mezeru mezi dvěma textovými oddíly tvoří VŽDY jen `padding-bottom` prvního
z nich.** Proto mají `.section--*` nastaveno `padding-top: 0`. Inline
`padding-top: var(--space-section)` se přidává jen tam, kde oddílu předchází
fotopás (ten má nulový padding).

Když se to pravidlo poruší, mezery se sečtou a vyjdou dvojnásobné —
naměřeno 300 px místo 135. Vypadá to jako záhada, přitom je to jen součet.

Pozor: `translateY` (galerie) a absolutně pozicované prvky **nezabírají výšku
v layoutu**, takže se mezera pod nimi musí dorovnat. U každé takové kompenzace
je v CSS komentář proč.

### Fonty (Google Fonts)

| Proměnná | Font | Použití |
|---|---|---|
| `--font-display` | Anton | h1, hero, citáty |
| `--font-head` | Oswald 400/500/600 | h2, h3, navigace, tlačítka |
| `--font-body` | Roboto 400 | běžný text |
| `--font-logo` | Cinzel 600 | **jen** logo „YES&" |

Velikosti jsou fluidní přes `clamp()` — např. `--fs-h1-hero: clamp(38px, 9vw, 69px)`.
Žádné `font-size` v px na jednotlivých prvcích, používej proměnné `--fs-*`.

### Responzivita

Mobile-first: základní pravidla platí pro mobil, jediný breakpoint
`@media (min-width: 900px)` je rozšíření pro desktop. Plus dva doplňkové
bloky pro tablet (600–899 px) tam, kde to bylo potřeba.

Testované šířky: 360, 390, 600, 768, 900, 1000, 1230, 1440 px.

---

## Pasti, které se v tomhle projektu vyskytly

**`<img>` s atributy `width`/`height` potřebuje `height: auto`.** Atributy jsou
správné (rezervují místo, brání poskakování při načítání), ale chovají se jako
pevná výška v px. Kdekoli pak CSS nastaví jen šířku, obrázek se roztáhne.
Řeší to globální pravidlo `img { max-width: 100%; height: auto; display: block; }`.
**Nemazat.**

**`background-attachment: fixed` mění pozicovací oblast na viewport.** V kombinaci
s `cover` to obrázek enormně zvětší a odřízne podstatné. Proto u hero fotky
draka žádný parallax není.

**Parallax je vypnutý na celém mobilu, ne jen u hera.** `background-attachment: fixed`
je na iOS Safari nespolehlivý, zatěžuje výkon a koliduje s nastavením „omezit
animace". Zůstává jen na fotopásech `.band` na desktopu.

**Popisek videa musí být ZA blokem `.video`, ne v něm.** `.video` má
`padding-top: 56.25%` + `overflow: hidden` (trik na poměr 16:9), takže cokoli
vevnitř se ořízne. A protože v mřížce by se popisek stal samostatnou buňkou
a rozhodil sloupce, je video + popisek obalené v `.video-block`.

**FAQ existuje na dvou místech.** HTML blok `.faq` v `caste-dotazy.html`
a `mainEntity` v JSON-LD tamtéž. **Když měníš otázku, změň ji na obou místech** —
jinak se schéma rozejde s obsahem a Google ho vyhodnotí jako neplatné.

**GA4 se nenačte, dokud návštěvník neodsouhlasí cookies.** Řeší to
`cookie-consent.js` — dokud nepadne "Přijmout", `gtag` neexistuje a žádný
požadavek na Google servery neodejde (GDPR/ePrivacy). Když testuješ návštěvnost
v „Přehledu v reálném čase", nezapomeň na vlastním prohlížeči banner odkliknout,
jinak se tvoje návštěva nezapočítá. Volba se pamatuje v `localStorage`
(`yesend_cookie_consent`), znovu otevřít jde přes odkaz „Nastavení cookies"
v patičce.

**Interní filtr (vyloučení vlastní návštěvnosti) v GA4 se záměrně nenastavuje.**
IP adresa dostupná při zakládání patřila firemní síti sdílené s cca 50 lidmi —
nastavení by vyřadilo z dat i jejich reálné návštěvy, ne jen Jakubovy. Filtr
"Internal Traffic" v GA4 existuje jako šablona, ale bez definované IP je
neškodný (nic nefiltruje).

---

## Obrázky

| Typ | Formát | Proč |
|---|---|---|
| Fotopásy `pas-*.webp` | WebP, 2400 px, q 72–84 | JPEG 1920 px q74 po zvětšení kostičkoval |
| Fotky v galerii, hero | JPEG | |
| Náhledy pro sociální sítě `og-*.jpg` | **JPEG**, 1200×630 | WebP sociální sítě nespolehlivě zpracují |
| Loga, ikony | PNG / WebP | |
| Favicon | bílý `&` na `#e4580b` | glyf zabírá 74 % plochy, jinak na 16 px splývá |

**Originály fotek v plném rozlišení v repu nejsou** — byly v zálohovém zipu,
který má Jakub stažený lokálně. Fotka `pas-mtg-stul` má originál jen
1440×810 px, takže se na širokém monitoru mírně roztahuje; jediné řešení je
nahradit ji lepší.

Hero obrázek je CSS pozadí, proto se v `<head>` předkládá:
`<link rel="preload" as="image" href="images/hero-drak.jpg" fetchpriority="high">`.

**YouTube videa se nevkládají hned.** Na stránce je jen náhledový obrázek
z `i.ytimg.com` a přehrávač se vloží až po kliknutí (facade pattern v `script.js`).
Ušetřilo to na D&D stránce 871 → 536 kB a nula kB přehrávačového JS při načtení.
Malé náhledy používají `sddefault.jpg` (640×480) a `object-fit: cover` odřízne
letterbox — YouTube v 16:9 nabízí jen 320 a 1280 px, nic mezi.

---

## SEO

- Každá stránka má `<title>` **začínající klíčovým slovem**, ne názvem klubu.
- JSON-LD jako `@graph` s propojenými `@id`: Organization, WebSite, WebPage,
  Place, BreadcrumbList, na FAQ stránce navíc FAQPage.
- **Záměrně tam NENÍ**: `openingHours` (klub nemá pevný rozvrh),
  `aggregateRating`, ceny, `VideoObject` u cizích videí. Neověřitelný údaj ve
  schématu je horší než žádný.
- Telefon nikde na webu není — jen e-mail. Vědomé rozhodnutí.
- Novou stránku vždy přidat do `sitemap.xml`.
- Google firemní profil se **nedělá** — klub sídlí v Čajbaru Pangea, který tam
  svůj profil má.
- **Jako místo se uvádí jen Čajbar Pangea.** SPŠ eMKO a Gymnázium Jeseník sice
  občas hostí hraní, ale nejsou primární lokace — zůstávají jen mezi partnery.
- FAQ zmiňuje Zlaté Hory, Javorník, Vidnavu a Šumperk **záměrně** — je to SEO
  na okolní města, kde je téměř nulová konkurence.

## Licence a ochranné známky

Cizí loga se smí použít **pouze jako prokliková loga v sekci Partneři**. Nikdy
jako vlastní branding webu, nikdy v hlavičce, nikdy jako dekorace.

V Partnerech jsou: eMKO, Čajbar Pangea, Gymnázium Jeseník, Černý Rytíř, Magic:
The Gathering, Wizards of the Coast, Dungeons & Dragons. Pod nimi je doložka
o ochranných známkách Wizards of the Coast, která pokrývá všechna použitá herní
loga.

**Logo Games Workshop se nepoužívá**, proto se pro ně doložka neuvádí. Kdyby se
někdy přidalo, musí přibýt i věta o ochranných známkách Games Workshop Limited.

U cizích artworků se vždy uvádí credit `Art by [Jméno autora]`.

## Formulář

Statický web nemá čím poslat e-mail, řeší to **Web3Forms**. Access key je
v `script.js` v konstantě `WEB3FORMS_KEY` (je veřejný, patří do klientského
kódu — nedá se s ním nic přečíst, jen odeslat).

Free plán: 250 zpráv/měsíc, přihlášky chodí na `fangorzjeseniku@gmail.com`.

Součástí je honeypot (skryté pole `botcheck` přes `.sr-only`, ne `hidden` —
část botů skrytá pole přeskakuje) a chybová hláška `#form-error` pro případ,
že API nedojede.

Kdyby klíč někdy vypršel, kód spadne zpět na `mailto:`, aby stránka nezůstala
bez funkce.

Úspěšné odeslání zároveň pošle do GA4 doporučenou událost `generate_lead`
(v `showDone()`) — jen pokud návštěvník odsouhlasil cookies. V GA4 je potřeba
ji jednou ručně označit jako klíčovou událost (Admin → Události). Skutečný počet
přihlášek = e-maily ve schránce, GA4 číslo bude nižší (nepočítá ty, kdo cookies
odmítli).

---

## Tón textů

- Oslovování v druhé osobě, rodové tvary s lomítkem (`jistý/á`, `nemusel/a`).
  **Jedna konvence napříč webem** — ne závorky, ne mužský rod.
- Vítanost musí zaznít v prvním výřezu (hero + „Kdy a kde"), ne na konci strany.
- Nevymýšlet fakta o klubu. Kolik má členů, kdo vede hry, jak často se schází —
  to se musí zeptat.
- Na webu jsou dvě tvrzení, která potvrdil Jakub až dodatečně a nelze je
  z webu ověřit: *„hráčky u nás jsou, i když zatím v menšině"* a *„přijít sám
  je běžný způsob, jak začít"*. Kdyby se to změnilo, upravit.
- **Přijít na slepo nejde** — první krok je vždy přihlášení na Discord.
  Web to nesmí nikde slibovat jinak. Pozvánku posílá člověk, ne robot; je to
  vědomé rozhodnutí kvůli bezpečnosti komunity.
- Cílová skupina je **15–30 let**. Tykání, žádný korporátní jazyk.

Cíle klubu, které se můžou promítnout do dalších úprav webu: zdvojnásobit počet
aktivních členů, zvýšit zastoupení žen, rozšířit řady Dungeon Masterů.

---

## Kontrola před nasazením

Vyplatí se ověřit: rozbité vnitřní odkazy, chybějící obrázky (z HTML i z `url()`
v CSS), neuzavřené HTML tagy, skoky v hierarchii nadpisů, validitu každého
`<script type="application/ld+json">`, soulad FAQ v HTML a ve schématu, syntaxi
`script.js` a vodorovné přetečení na 360 / 390 / 768 / 900 / 1440 px.
