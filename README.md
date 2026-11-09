# Bhinneka Sans — Home FIX + Share Edition v11 + Discover (2D)

Open `index.html` in your browser or deploy the entire folder unchanged.

- **Home:** Keeps the screensaver/animation from BSans-Home-FIX with only the original Create Your Own entry button. Discover is not shown on the home screen.
- **Type Playground:** Keeps the Share Edition v11 typing, hover-and-lock vowels, downloadable font, PNG/SVG and sharing interactions. A Discover link is in the playground top-left header.
- **Discover:** Open via the Type Playground. The top navigation has HOME | DISCOVER and TYPE PLAYGROUND. A/E/I/O/U selectors are at the top, a large original 2D letter appears without a frame, and left/right arrows cycle through 38 provincial variants. The information panel shows code, province, region, 2020 island-region population, text-sample vowel frequency, and English & Korean copy without story headings or duplicate prev/next buttons. No 3D feature or related control remains.

### Data interpretation
Population values are 2020 island-region census estimates, not individual province populations. Vowel percentages come from the single cited Indonesian-language sample (not a universal distribution). Source URLs are available under DATA SOURCES on the Discover page. The page contains all 38 caption/letterform combinations.

### Controls
- On Discover, use the large ← / → arrows or left/right keyboard arrows to change letterforms.
- Use A, E, I, O, U to jump to that vowel's first provincial variant.
- Navigate to Home or Type Playground from Discover's header.

Everything runs locally, without external libraries, accounts, or an internet connection. The Data Sources links require internet only when opened.


Discover X-ray inspection (new): Move the pointer over the large letter to reveal a tracking circular lens displaying real glyph paths, on-curve anchors (squares), quadratic off-curve controls (rings), and construction handles. Leave to hide. Tap on touch screens or press Enter while focused on the letter to toggle. No 3D.


## Discover V3 refinements (2026-11-09)
- The X-ray lens is white with true black outline strokes, dark anchor nodes, dotted control guides, and hollow handles. The glyph behind the lens remains solid black.
- Full-width unboxed A / E / I / O / U text tabs sit immediately below the Discover navigation.
- Removed the “01 / Provincial Letterforms”, “Hover to reveal the outline”, and “02 / Cultural Archive” decorative headers.
- Raised the displayed letter by reclaiming heading space and aligning the glyph viewer higher.
- Province names are now title-case with smaller, more restrained typography.
- Kept the original Home FIX and Share Edition v11 playground intact.

## Discover v4 UI adjustments (Nov 9, 2026)
- Explore by Vowel and five A/E/I/O/U buttons share a single line, sized equally.
- Vowel selection is aligned above the large glyph in its left column and remains unboxed.
- Removed the bottom-left “Explore Indonesia, One Letter at a Time” footer text. Data Sources remains at bottom right.
- Home FIX, Share v11 playground, bilingual descriptions, 38 glyphs, X-ray outline, and navigation stay the same.


## Navigation (latest revision)
- The Discover and Type Playground views now share left-aligned `HOME · DISCOVER · CREATE YOUR OWN ↗` navigation. The current view is bold.
- The Home landing remains unchanged and has no top navigation, preserving the requested immersive experience.
- The Type Playground retains the `DOWNLOAD FONT` link on the right.


V5 UPDATE: Removed the “EXPLORE BY VOWEL” label on Discover; vowel shortcuts (A E I O U) are right-aligned within the glyph column. All other website navigation and interactions are preserved.


V6 UPDATE: Moved the five A/E/I/O/U shortcuts beneath the large glyph and horizontally centered them (matching the provided screenshot). The arrows remain beside the glyph. No other navigation, X-ray, home, playground, font, or province panel behavior has changed.

## V7 — spacing aligned to reference screenshot
- A consistent 48–72px desktop gap separates the main navigation from Discover content.
- The glyph canvas and the cultural-information panel use the same visual height and baseline.
- Letter silhouettes can extend slightly beyond their SVG padded area to align visually with the panel edges.
- Arrows remain vertically centered beside the glyph, and vowels are centered 30px below the letter area.
- Tablet and mobile spacing is adjusted separately, without changing Home, Playground, X-ray, or data.


## Cleanup and UI fixes (Nov 9, 2026)

Behaviour, data, glyphs and interactions are unchanged. What changed:

**Layout fixes**
- One shared page inset (`--gutter`) for the navigation, playground canvas, status bar, specimen, Discover content and Discover footer. Previously each area used a different padding.
- Playground masthead and Discover navigation now share the same height (`--header-h`), so the links no longer jump when switching views.
- Discover information panel uses `min-height` instead of a fixed height, so long English/Korean descriptions can no longer spill past its bottom border on 1280×720 laptops.
- Removed the 5px offset hack on the first toolbar group; divider lines now line up when the toolbar wraps.
- Toolbar dividers are generated per row (3 + 3, then 2 + 2 + 2) instead of relying on a double bottom border.
- A / E / I / O / U shortcuts on Discover keep their 11px look but now have a 44px tap area.
- Status bar messages wrap on phones instead of being cut off with an ellipsis.

**Behaviour fixes (script.js)**
- The AUTO font size is re-checked after live vowel previews, shuffle or locking a vowel, so wider stylistic sets no longer push a word onto an extra line.
- The 90-second idle return to Home no longer fires while the Save dialog is open.

**Code cleanup**
- `style.css` rewritten as one pass per component (about 20KB instead of 66KB of stacked V3–V15 overrides and `!important`). Dead rules for removed home-screen and Discover elements are gone.
- `script.js`: removed the dead "glyph ecosystem" block, which also defined duplicate `createScreensaver` / `startHomeSequence` / `stopHomeSequence` functions; removed unused helpers. `layoutEcosystem` is now `layoutHome`.
- Font file renamed to `BhinnekaSans-1108.ttf` (no space in the name) and the duplicate copy removed. `glyphs.json` removed; the site reads `glyphs-data.js`.

**Known, left as is**
- On Discover every letter is scaled to fill the same frame, so `u.ss02` (a wide, short form) renders a little smaller than its neighbours. Changing this would mean changing the design rule for all 38 glyphs.


## Fix — editor focus border removed (Nov 9)

Removed the shared `[contenteditable]:focus-visible` outline that created a black rectangle around the typing area on Safari. The text cursor and editing behavior remain unchanged; button keyboard focus outlines are preserved.
