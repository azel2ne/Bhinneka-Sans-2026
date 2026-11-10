Bhinneka Sans — exhibition iMac adjustments

Only at viewport >= 1400px wide AND >= 780px high:
- CREATE YOUR OWN button scales up on large iMac
- Discover X-ray lens is capped at 160px diameter and kept clear of vowel controls
- Typewriter starts at 340px instead of 240px; shorter views retain 240px
- Larger-size toolbar can increase up to 460px (regular desktop max stays 300px)

Existing other layout and functionality preserved.

Adjust in style.css: search 'iMac-only refinements'
Adjust default font in script.js: search 'isImacDisplay()?340:240'
Adjust lens radius in discover.js: search '80/screenScale'


Readability update (V2):
- iMac X-ray lens diameter 160px → 270px; retains controls' top stacking.
- iMac hover glyph ID/province text ~12–13px.
- iMac Discover card label and province grid caption text ~12–13px.
- Media query exclusively (min-width:1400px) and (min-height:780px).
- Standard desktop/tablet/mobile behavior untouched.

Typewriter default font size: 460 px on iMac-sized viewports (>=1400 px width and >=780 px height); 240 px elsewhere. Existing auto-fit preserved.
