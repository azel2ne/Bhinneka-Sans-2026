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


## Updated: Typewriter, Reset and Discover Archive (2026-11-10)
- The top navigation reads HOME · DISCOVER · TYPEWRITER (formerly CREATE YOUR OWN). The animated home entry button remains CREATE YOUR OWN.
- VOWELS → RESET replaces CHANGE. Clicking RESET immediately unlocks all selected vowels and resumes their red, randomly cycling variants without deleting your text. SHUFFLE and direct vowel selection still work.
- The complete Letterform Archive (38 provincial glyphs plus Plus Jakarta Sans base character reference) now appears **under the large X-ray viewer in Discover**, not below the Typewriter.
- Click a provincial glyph in the archive to open that exact variant in the big Discover viewer, automatically update its province name, region, stats and English/Korean descriptions, and scroll back to the large viewer.
- The base glyph library remains a reference grid; it does not represent a province, so it isn't a selectable entry in the 38-province X-ray viewer.
- To deploy: upload the updated top-level website files to the connected GitHub repository's production branch; Vercel will automatically deploy them to the existing custom domain if its project connection is configured.


## November 2026 archive-scroll polish

- Browser tab title is exactly `Bhinneka Sans`.
- Down-arrow at the lower right of Discover's first viewport smoothly navigates to Letterform Archive.
- Archive begins below the visible first screen, with extra spacing to avoid a partial section.
- Removed `content-visibility: auto` from glyph cells to avoid variable scroll offsets on Safari.
- Added light layout/paint containment instead, keeping explicit glyph cell dimensions.
- Native manual wheel/trackpad scrolling is preserved; button navigation is smoothly animated.
- This remains a static website, ready for GitHub/Vercel.


## Latest navigation & web typography update
- Navigation on Discover: HOME · TYPEWRITER · DISCOVER.
- Navigation on Typewriter: TYPEWRITER · DISCOVER (no HOME). The original home screen still works via the HOME link on Discover.
- UI and English descriptions now use **Inter**. Korean descriptions and province names use **Pretendard Variable**.
- Custom **Bhinneka Sans** remains unchanged for the animated glyphs, Typewriter artwork and specimen.
- Webfonts load from Google Fonts (Inter) and the Pretendard official jsDelivr stylesheet (v1.3.9). An internet connection is needed to load webfonts; offline fallback fonts are specified.


## Navigation + text fonts (2026-11-10)
- Typewriter header: HOME · TYPEWRITER · DISCOVER, left-aligned. HOME returns to the animated landing screen.
- Discover header: HOME · TYPEWRITER · DISCOVER.
- Removed the old bottom-right HOME action from the Typewriter status bar.
- Latin UI text uses Inter, Korean descriptions and province names use Pretendard Variable (served via public web CDNs). The custom Bhinneka Sans font is retained for the letters.
- Note: Inter and Pretendard require internet access when first loaded; browser/system fallbacks are provided.


## Discover layout fine adjustment (2026-11-10)
- Raised the Discover letter, info panel, and Data Sources row slightly on desktop.
- Added a small spacer before the Letterform Archive to prevent its heading appearing at the bottom of the initial screen.
- Adjusted short laptop viewport dimensions (height <= 800px) so the bottom footer row remains visible.
- Kept Data Sources expandable, the gray arrow link, the original Typewriter, and all font data unchanged.


## Final Discover spacing refinements (10 Nov 2026)

- Removes extra lower dividers and excess empty space below expanded DATA NOTES; the notes remain collapsible.
- When expanded, the Letterform Archive follows without the old 56px spacer/double rule.
- Raises the Discover glyph and information panel together by 9px on desktop/tablet.
- Leaves the footer's DATA SOURCES toggle and down arrow in the same row.


## Latest layout refinement
On desktop, the Discover glyph, vowel selector, and province information panel have been lifted by an additional 16px (total -25px), leaving the DATA SOURCES/footer, archive, and all interactive behavior unchanged.


## Discover — precise information card alignment (Nov 10, 2026)
- Desktop: only the information card is translated vertically to align its bottom border with the actual bottom of the selected letterform's SVG path. The letter, left/right arrows, and A/E/I/O/U row are unchanged.
- This automatically readjusts when a province is selected or the viewport changes, including for short and narrow glyphs.
- Mobile retains the original stacked layout.
- DATA SOURCES accordion and archive link are untouched.
