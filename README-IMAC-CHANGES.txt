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
