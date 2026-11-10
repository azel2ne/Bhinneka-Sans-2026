BHINNEKA SANS — MacBook fullscreen layout fix

Open index.html for BOTH MacBook and exhibition iMac. No separate pages.

The site still adapts to the browser viewport. Exhibition mode also requires
a 16:9-like physical display (screen aspect ratio >= 1.70).
MacBook built-in screens are typically 16:10 or taller, so fullscreen will
keep the normal desktop mode; 16:9 iMacs use iMac mode when their viewport
is large enough.

Only the automatic iMac layout detection has changed. Existing typography,
interactions, animations, 90-second idle return, and visual designs remain
unchanged for their respective modes.

Note: Websites cannot reliably identify MacBook vs iMac hardware directly.
An external widescreen display attached to a MacBook may use iMac mode.
