# Checkout pages — verification report (2026-10-07)

Checked 91 candidate cart/checkout URLs with curl (browser UA, redirects followed, page-content bot-challenge scan).
**33 verified** (HTTP 200, real cart/bag page, no bot wall, no login wall) → shipped in `checkout-pages.ts` + `checkout-seed.sql`.

| Company | URL checked | HTTP | Final URL | Verdict | Notes |
|---|---|---|---|---|---|
| Allbirds | https://www.allbirds.com/cart | 200 | https://www.allbirds.com/cart | verified | HTTP 200 |
| Barnes & Noble | https://www.barnesandnoble.com/cart | 200 | https://www.barnesandnoble.com/cart | verified | HTTP 200 |
| Bose | https://www.bose.com/cart | 200 | https://www.bose.com/cart | verified | HTTP 200 |
| Casper | https://casper.com/cart | 200 | https://casper.com/cart | verified | HTTP 200 |
| Champs Sports | https://www.champssports.com/cart | 200 | https://www.champssports.com/cart | verified | HTTP 200 |
| Corsair | https://www.corsair.com/us/en/cart | 200 | https://www.corsair.com/us/en/cart | verified | HTTP 200 |
| Crocs | https://www.crocs.com/cart | 200 | https://www.crocs.com/cart | verified | HTTP 200 |
| DSW | https://www.dsw.com/en/us/cart | 200 | https://www.dsw.com/cart | verified | redirects to https://www.dsw.com/cart |
| Fanatical | https://www.fanatical.com/cart | 200 | https://www.fanatical.com/en/cart | verified | redirects to https://www.fanatical.com/en/cart |
| Foot Locker | https://www.footlocker.com/cart | 200 | https://www.footlocker.com/cart | verified | HTTP 200 |
| GOG | https://www.gog.com/cart | 200 | https://www.gog.com/cart | verified | HTTP 200 |
| Gap | https://www.gap.com/shopping-bag | 200 | https://secure-www.gap.com/shopping-bag | verified | redirects to https://secure-www.gap.com/shopping-bag |
| Google | https://store.google.com/cart | 200 | https://store.google.com/cart?hl=en-US | verified | redirects to https://store.google.com/cart?hl=en-US |
| IKEA | https://www.ikea.com/us/en/shoppingcart/ | 200 | https://www.ikea.com/us/en/shoppingcart/ | verified | HTTP 200 |
| JCPenney | https://www.jcpenney.com/cart | 200 | https://www.jcpenney.com/cart | verified | HTTP 200 |
| LEGO | https://www.lego.com/en-us/cart | 200 | https://www.lego.com/en-us/cart | verified | HTTP 200 |
| Logitech | https://www.logitech.com/en-us/cart | 200 | https://www.logitech.com/en-us/cart | verified | HTTP 200 |
| Lowe's | https://www.lowes.com/cart | 200 | https://www.lowes.com/cart | verified | HTTP 200 |
| Microsoft | https://www.microsoft.com/en-us/store/cart | 200 | https://www.microsoft.com/en-us/store/cart | verified | HTTP 200 |
| Newegg | https://secure.newegg.com/Shopping/ShoppingCart.aspx | 200 | https://secure.newegg.com/shop/cart | verified | redirects to https://secure.newegg.com/shop/cart |
| Nintendo | https://www.nintendo.com/us/cart/ | 200 | https://www.nintendo.com/us/cart/ | verified | HTTP 200 |
| Nordstrom | https://www.nordstrom.com/shopping-bag | 200 | https://www.nordstrom.com/shopping-bag | verified | HTTP 200 |
| Peloton | https://www.onepeloton.com/cart | 200 | https://www.onepeloton.com/cart | verified | HTTP 200 |
| Sony | https://store.playstation.com/en-us/cart | 200 | https://store.playstation.com/en-us/pages/cart/ | verified | redirects to https://store.playstation.com/en-us/pages/cart/ |
| Razer | https://www.razer.com/cart | 200 | https://www.razer.com/cart | verified | HTTP 200 |
| Reebok | https://www.reebok.com/cart | 200 | https://www.reebok.com/cart | verified | HTTP 200 |
| Sephora | https://www.sephora.com/basket | 200 | https://www.sephora.com/basket | verified | HTTP 200 |
| Sonos | https://www.sonos.com/en-us/cart | 200 | https://www.sonos.com/en-us/emptycart | verified | redirects to https://www.sonos.com/en-us/emptycart |
| Valve | https://store.steampowered.com/cart/ | 200 | https://store.steampowered.com/cart/ | verified | HTTP 200 |
| Ulta | https://www.ulta.com/bag | 200 | https://www.ulta.com/bag | verified | HTTP 200 |
| Under Armour | https://www.underarmour.com/en-us/cart | 200 | https://www.underarmour.com/en-us/cart/ | verified | redirects to https://www.underarmour.com/en-us/cart/ |
| Microsoft | https://www.xbox.com/en-US/cart | 200 | https://www.xbox.com/en-US/cart | verified | HTTP 200 |
| Zara | https://www.zara.com/us/en/shop/cart | 200 | https://www.zara.com/us/en/shop/cart | verified | HTTP 200 |
| ASOS | https://www.asos.com/us/bag | 403 | https://www.asos.com/us/bag | blocked | bot wall / access denied |
| Adorama | https://www.adorama.com/cart | 403 | https://www.adorama.com/cart | blocked | bot wall / access denied |
| AliExpress | https://www.aliexpress.com/cart | 200 | https://www.aliexpress.com/s/error/404 | blocked | redirects to /s/error/404 |
| American Eagle | https://www.ae.com/us/en/cart | 403 | https://www.ae.com/us/en/cart | blocked | bot wall / access denied |
| B&H Photo | https://www.bhphotovideo.com/c/cart | 403 | https://www.bhphotovideo.com/c/cart | blocked | bot wall / access denied |
| Belk | https://www.belk.com/cart | 403 | https://www.belk.com/cart | blocked | bot wall / access denied |
| Bloomingdale's | https://www.bloomingdales.com/bag | 403 | https://www.bloomingdales.com/bag | blocked | bot wall / access denied |
| CDW | https://www.cdw.com/cart | 200 | https://www.cdw.com/cart | blocked | bot wall / access denied |
| Converse | https://www.converse.com/shop/cart | 403 | https://www.converse.com/shop/cart | blocked | bot wall / access denied |
| Crate & Barrel | https://www.crateandbarrel.com/cart | 403 | https://www.crateandbarrel.com/cart | blocked | bot wall / access denied |
| Dick's | https://www.dickssportinggoods.com/f/cart | 403 | https://www.dickssportinggoods.com/f/cart | blocked | bot wall / access denied |
| DoorDash | https://www.doordash.com/cart | 403 | https://www.doordash.com/cart | blocked | bot wall / access denied |
| Dyson | https://www.dyson.com/cart | 403 | https://www.dyson.com/cart | blocked | bot wall / access denied |
| Epic Games | https://store.epicgames.com/en-US/cart | 403 | https://store.epicgames.com/en-US/cart | blocked | bot wall / access denied |
| Epic Games | https://www.epicgames.com/cart | 403 | https://www.epicgames.com/cart | blocked | bot wall / access denied |
| Express | https://www.express.com/cart | 403 | https://www.express.com/cart | blocked | bot wall / access denied |
| Finish Line | https://www.finishline.com/cart | 403 | https://www.finishline.com/cart | blocked | bot wall / access denied |
| GameStop | https://www.gamestop.com/cart/ | 403 | https://www.gamestop.com/cart/ | blocked | bot wall / access denied |
| GoPro | https://gopro.com/en/us/cart | 403 | https://gopro.com/en/us/cart | blocked | bot wall / access denied |
| H&M | https://www.hm.com/us/cart | 403 | https://www.hm.com/us/cart | blocked | bot wall / access denied |
| Kohl's | https://www.kohls.com/cart | 403 | https://www.kohls.com/cart | blocked | bot wall / access denied |
| Levi's | https://www.levi.com/US/en_US/cart | 403 | https://www.levi.com/US/en_US/cart | blocked | bot wall / access denied |
| Macy's | https://www.macys.com/bag | 403 | https://www.macys.com/bag | blocked | bot wall / access denied |
| Micro Center | https://www.microcenter.com/cart | 403 | https://www.microcenter.com/cart | blocked | bot wall / access denied |
| New Balance | https://www.newbalance.com/cart | 403 | https://www.newbalance.com/cart | blocked | bot wall / access denied |
| Patagonia | https://www.patagonia.com/cart | 200 | https://www.patagonia.com/cart | blocked | bot wall / access denied |
| Petco | https://www.petco.com/shop/en/petcostore/cart | 403 | https://www.petco.com/shop/en/petcostore/cart | blocked | bot wall / access denied |
| SHEIN | https://us.shein.com/cart | 200 | https://us.shein.com/risk/action/limit?risk-id=E4925451220883235332 | blocked | HTTP 200 but lands on /risk/action/limit bot-verification page |
| Skechers | https://www.skechers.com/cart | 429 | https://www.skechers.com/cart | blocked | bot wall / access denied |
| The North Face | https://www.thenorthface.com/en-us/cart | 403 | https://www.thenorthface.com/en-us/cart | blocked | bot wall / access denied |
| Uber | https://www.ubereats.com/cart | 403 | https://www.ubereats.com/cart | blocked | bot wall / access denied |
| Uniqlo | https://www.uniqlo.com/us/en/cart | 200 | https://www.uniqlo.com/us/en/cart | blocked | bot wall / access denied |
| Vans | https://www.vans.com/en-us/cart | 403 | https://www.vans.com/en-us/cart | blocked | bot wall / access denied |
| Walgreens | https://www.walgreens.com/cart | 200 | https://www.walgreens.com/login.jsp?ru=/cart | blocked | redirects to login.jsp?ru=/cart — login wall, screenshot would show login form |
| Warby Parker | https://www.warbyparker.com/cart | 403 | https://www.warbyparker.com/cart | blocked | bot wall / access denied |
| West Elm | https://www.westelm.com/cart | 403 | https://www.westelm.com/cart | blocked | bot wall / access denied |
| Williams-Sonoma | https://www.williams-sonoma.com/cart | 403 | https://www.williams-sonoma.com/cart | blocked | bot wall / access denied |
| lululemon | https://shop.lululemon.com/c/bags | 403 | https://shop.lululemon.com/c/bags | blocked | bot wall / access denied |
| Abercrombie | https://www.abercrombie.com/shop/cart | 200 | https://www.abercrombie.com/shop/us | homepage-redirect | cart path redirects to storefront home (/shop/us) |
| Academy Sports | https://www.academy.com/shop/cart | 200 | https://www.academy.com/ | homepage-redirect | cart path redirects to storefront home (https://www.academy.com/) |
| Puma | https://www.puma.com/us/en/cart | 200 | https://us.puma.com/us/en | homepage-redirect | cart path redirects to storefront home (us.puma.com/us/en) |
| Temu | https://www.temu.com/cart | 200 | https://www.temu.com/ | homepage-redirect | cart path silently redirects to bare homepage |
| ASUS | https://www.asus.com/us-en/cart | 404 | https://www.asus.com/us-en/cart/ | unverified | HTTP 404 |
| CVS | https://www.cvs.com/cart | 503 | https://www.cvs.com/cart | unverified | HTTP 503 |
| Chewy | https://www.chewy.com/cart | 404 | https://www.chewy.com/cart | unverified | HTTP 404 |
| Chewy | https://www.chewy.com/cart/ | 404 | https://www.chewy.com/cart | unverified | HTTP 404 |
| HP | https://www.hp.com/us-en/shop/cart | 0 | https://www.hp.com/us-en/shop/cart | unverified | HTTP 0 (curl: (28) Operation timed out after 25002 milliseconds with 0 bytes received) |
| HP | https://www.hp.com/cart | 404 | https://www.hp.com/cart | unverified | HTTP 404 |
| Humble Bundle | https://www.humblebundle.com/cart | 404 | https://www.humblebundle.com/cart | unverified | HTTP 404 |
| Instacart | https://www.instacart.com/store/checkout | 404 | https://www.instacart.com/store/checkout | unverified | HTTP 404 |
| Instacart | https://www.instacart.com/checkout | 404 | https://www.instacart.com/checkout | unverified | HTTP 404 |
| Meta | https://www.meta.com/cart | 400 | https://www.meta.com/cart/ | unverified | HTTP 400 |
| Meta | https://www.meta.com/us/store/cart/ | 400 | https://www.meta.com/us/store/cart/ | unverified | HTTP 400 |
| Newegg | https://www.newegg.com/cart | 404 | https://www.newegg.com/cart | unverified | HTTP 404 |
| Office Depot | https://www.officedepot.com/cart | 404 | https://www.officedepot.com/cart | unverified | HTTP 404 |
| REI | https://www.rei.com/cart | 0 | https://www.rei.com/cart | unverified | HTTP 0 (curl: (28) Operation timed out after 25001 milliseconds with 0 bytes received) |
| Staples | https://www.staples.com/cart | 404 | https://www.staples.com/cart | unverified | HTTP 404 |
| Tractor Supply | https://www.tractorsupply.com/cart | 0 | https://www.tractorsupply.com/cart | unverified | HTTP 0 (curl: (28) Operation timed out after 25001 milliseconds with 0 bytes received) |

## Not included (and why)
- Bot-walled cart pages (403 / challenge): Epic Games, Dyson, H&M, Petco, Macy's, Kohl's, ASOS, B&H Photo, GameStop, Dick's, lululemon, Warby Parker, GoPro, Vans, Converse, Levi's, American Eagle, Belk, New Balance, Micro Center, Express, Uber Eats, DoorDash, Williams-Sonoma, Crate & Barrel, West Elm, Bloomingdale's, Finish Line, Skechers, The North Face, Adorama, CDW, SHEIN.
- Dead cart paths (404/503/timeout): Chewy, CVS, REI, Staples, Office Depot, HP, Meta Store, ASUS, Tractor Supply, Humble Bundle, Instacart.
- Redirects that aren't real cart pages: Temu, Puma, Abercrombie (→ storefront home); AliExpress (→ error page); Walgreens (→ login wall).

## Wiring
1. Append the `checkoutNew` rows from `checkout-pages.ts` to the `checkout` array in `lib/designmash/data.ts`.
2. Run `checkout-seed.sql` in Supabase (apply the earlier full `seed.sql` first if not already applied).
Screenshots render on demand via mShots (`image_url`); first view can take ~30s while it generates.


## Integration check (2026-10-07)

Imported all 33 rows and their supplied screenshot URLs into DESIGNMASH.
The URL checks above came from the supplied report, not screenshot verification.
A direct mShots check for LEGO initially returned its generating placeholder;
a later request returned a screenshot of LEGO's bot-block page. The renderer
can therefore be blocked even where curl-based cart verification succeeds.
The interface retries pending mShots captures automatically. Actual checkout
images should be reviewed or replaced with provided captures where blocked.


## Screenshot correction (2026-10-07)

All 33 screenshot responses were downloaded and visually reviewed. Only 18
showed usable cart screens; these are now bundled locally. The other 15 showed
bot walls, errors, raw responses, obstructing overlays, or incomplete pages.
The ten original placeholder records also have no usable capture. All 43
records and scores remain stored, but checkout matchups select only records
with a usable screenshot. See checkout-captures.json for the capture inventory.
