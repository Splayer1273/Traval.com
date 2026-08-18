/**
 * Centralized image configuration.
 *
 * Every image in the app flows through this module so assets can be swapped
 * for a CDN or the backend's media endpoint in one place. Images are served
 * from Unsplash's CDN with auto-format + sizing parameters.
 */

const U = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const IMAGES = {
  // Destinations
  dubai: U('1512453979798-5ea266f8880c'),
  bali: U('1537996194471-e657df975ab4'),
  maldives: U('1514282401047-d79a71a590e8'),
  kashmir: U('1596173271697-b0e3e71e31e5', 1200),
  singapore: U('1525625293386-3f8f99389edd'),
  thailand: U('1552465011-b4e21bf6e79a'),
  europe: U('1467269204594-9661b134dd2b'),
  paris: U('1502602898657-3e91760cbb34'),
  tokyo: U('1540959733332-eab4deabeeaf'),
  london: U('1513635269975-59663e0ac1ad'),
  newyork: U('1496442226666-8d4d0e62e6e9'),
  rome: U('1552832230-c0197dd311b5'),
  santorini: U('1613395877344-13d4a8e0d49e'),
  swiss: U('1530122037265-a5f1f91d3b99'),
  tajmahal: U('1564507592333-c60657eea523'),
  jaipur: U('1477587458883-47145ed94245'),
  goa: U('1512343879784-a960bf40e7f2'),
  kerala: U('1602216056096-3b40cc0c9944'),
  ladakh: U('1544482422-2f2f0a8d9a8f', 1200),
  himalayas: U('1464822759023-fed622ff2c3b'),
  beach: U('1507525428034-b723cf961d3e'),
  desert: U('1509316785289-025f5b846b35'),
  egypt: U('1503177119275-0aa32b3a9368'),
  city: U('1519501025264-65ba15a82390'),
  roadtrip: U('1477959858617-67f85cf4f1df', 1200),

  // Hotels
  hotelPool: U('1566073771259-6a8506099945'),
  hotelRoom: U('1611892440504-42a792e24d32'),
  hotelLobby: U('1551882547-ff40c63fe5fa'),
  hotelSuite: U('1590490360182-c33d57733427'),
  hotelExterior: U('1564501049412-61c2a3083791', 1200),
  resort: U('1571896349842-33c89424de2d'),
  hotelMumbai: U('1582719508461-905c673771fd'),
  hotelDelhi: U('1520250497591-112f2f40a3f4'),
  hotelParis: U('1520256862855-398228c41684'),
  hotelLondon: U('1560200353-ce0a76b1d438'),
  hotelSingapore: U('1512918728675-ed5a9ecdebfd'),
  hotelAlpine: U('1626095933808-542c1b158736', 1200),

  // Travel / flights
  plane: U('1436491865332-7a61a109cc05', 1600),
  planeWing: U('1474302770737-173ee21bab63'),
  airport: U('1432612618399-4c9a2f9b8e1f'),
  luggage: U('1553697388-94b7f87ef8c0'),
  passport: U('1554774853-719586f396d3'),
  boarding: U('1569154941061-2310f98db756'),

  // Activity / lifestyle
  food: U('1414235077428-338989a2e8c0'),
  spa: U('1544161515-4ab6ce6db874'),
  shopping: U('1483985988355-763728e1935b'),
  adventure: U('1544551763-46a013bb70d5'),
  honeymoon: U('1520256611334-2f00c5f8b540'),
  family: U('1503919545889-efb1e1d6d4b6'),
  luxury: U('1540549860332-3a3a82b78034'),
  cruise: U('1548574505-5e239809ee19'),
  wildlife: U('1547471080-7cc2caa01a7e'),

  // Nature escapes — scenic travel & nature photography
  forest: U('1441974231531-c6227db76b6e'),
  lake: U('1506905925346-21bda4d32df4'),
  mountainLake: U('1501785888041-af3ef285b470'),
  waterfall: U('1432405972618-c60b0225b8f9'),
  hiking: U('1488646953014-85cb44e25828'),
  camping: U('1551632811-561732d1e306'),
  stars: U('1519681393784-d120267933ba'),
  canoe: U('1476514525535-07fb3b4ae5f1'),
  campfire: U('1504280390367-361c6d9f38f4'),
  canopy: U('1447752875215-b2761acb3c5d'),
  balloons: U('1507608619659-017fd23f42ef'),
  road: U('1469854523086-cc02fe5d8800'),
  scuba: U('1544551763-46a013bb70d5'),
  palmBeach: U('1519046904884-53103b34b206'),

  // Hero
  hero: U('1502920917128-1aa500764cbd', 1920),
  hero2: U('1436491865332-7a61a109cc05', 1920),
  cta: U('1467269204594-9661b134dd2b', 1920),
  offers: U('1533929736458-ca588d08c8be', 1600),
}

/** Fallback used when any image fails to load (gradient with sunrise mark). */
export const FALLBACK_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dde7ff"/><stop offset="0.55" stop-color="#c7d2fe"/><stop offset="1" stop-color="#fed7aa"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><circle cx="640" cy="150" r="55" fill="#fb923c" opacity="0.85"/><path d="M0 470 Q 200 380 420 440 T 800 400 V600 H0 Z" fill="#ffffff" opacity="0.5"/></svg>`,
  )
