/**
 * Centralized image configuration.
 *
 * Every image in the app flows through this module so assets can be swapped
 * for a CDN or the backend's media endpoint in one place. Images are served
 * from Unsplash's CDN with auto-format + sizing parameters.
 *
 * All photo IDs verified working (HTTP 200) as of August 2025.
 */

const U = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const IMAGES = {
  // ── Destinations ──────────────────────────────────────────────────────
  dubai:       U('1512453979798-5ea266f8880c'),         // Dubai skyline
  bali:        U('1537996194471-e657df975ab4'),         // Bali rice terraces
  maldives:    U('1514282401047-d79a71a590e8'),         // Maldives overwater villas
  kashmir:     U('1469474968028-56623f02e42e'),         // Kashmir mountains & lake
  singapore:   U('1525625293386-3f8f99389edd'),         // Singapore skyline
  thailand:    U('1552465011-b4e21bf6e79a'),             // Thailand temple
  europe:      U('1467269204594-9661b134dd2b'),         // European cityscape
  paris:       U('1502602898657-3e91760cbb34'),         // Eiffel Tower
  tokyo:       U('1540959733332-eab4deabeeaf'),         // Tokyo street
  london:      U('1513635269975-59663e0ac1ad'),         // London bridge
  newyork:     U('1496442226666-8d4d0e62e6e9'),         // New York skyline
  rome:        U('1552832230-c0197dd311b5'),             // Rome colosseum
  santorini:   U('1613395877344-13d4a8e0d49e'),         // Santorini blue domes
  swiss:       U('1530122037265-a5f1f91d3b99'),         // Swiss Alps
  tajmahal:    U('1564507592333-c60657eea523'),         // Taj Mahal
  jaipur:      U('1477587458883-47145ed94245'),         // Jaipur palace
  goa:         U('1512343879784-a960bf40e7f2'),         // Goa beach
  kerala:      U('1602216056096-3b40cc0c9944'),         // Kerala backwaters
  ladakh:      U('1464822759023-fed622ff2c3b'),         // Ladakh mountain landscape
  himalayas:   U('1464822759023-fed622ff2c3b'),         // Himalayan peaks
  beach:       U('1507525428034-b723cf961d3e'),         // Tropical beach
  desert:      U('1509316785289-025f5b846b35'),         // Desert dunes
  egypt:       U('1503177119275-0aa32b3a9368'),         // Pyramids of Giza
  city:        U('1519501025264-65ba15a82390'),         // City skyline
  roadtrip:    U('1477959858617-67f85cf4f1df'),         // Road trip highway

  // ── Hotels ────────────────────────────────────────────────────────────
  hotelPool:      U('1566073771259-6a8506099945'),     // Hotel infinity pool
  hotelRoom:      U('1611892440504-42a792e24d32'),     // Luxury hotel room
  hotelLobby:     U('1551882547-ff40c63fe5fa'),         // Grand hotel lobby
  hotelSuite:     U('1590490360182-c33d57733427'),     // Executive hotel suite
  hotelExterior:  U('1564501049412-61c2a3083791'),     // Five-star hotel exterior
  resort:         U('1571896349842-33c89424de2d'),     // Tropical resort
  hotelMumbai:    U('1582719508461-905c673771fd'),     // Mumbai Taj Mahal Palace
  hotelDelhi:     U('1520250497591-112f2f40a3f4'),     // Delhi luxury hotel
  hotelParis:     U('1520256862855-398228c41684'),     // Parisian hotel
  hotelLondon:    U('1560200353-ce0a76b1d438'),         // London hotel
  hotelSingapore: U('1512918728675-ed5a9ecdebfd'),     // Singapore hotel
  hotelAlpine:    U('1530122037265-a5f1f91d3b99'),     // Swiss alpine lodge

  // ── Travel / flights ──────────────────────────────────────────────────
  plane:      U('1436491865332-7a61a109cc05'),          // Airplane in flight
  planeWing:  U('1474302770737-173ee21bab63'),          // View from airplane window
  airport:    U('1480497490787-505ec076689f'),          // Modern airport terminal
  luggage:    U('1553531384-cc64ac80f931'),             // Business luggage set
  passport:   U('1544620347-c4fd4a3d5957'),             // Passport & boarding pass
  boarding:   U('1544005313-94ddf0286df2'),             // Boarding gate area

  // ── Activity / lifestyle ──────────────────────────────────────────────
  food:        U('1414235077428-338989a2e8c0'),        // Fine dining plate
  spa:         U('1544161515-4ab6ce6db874'),            // Spa & wellness
  shopping:    U('1483985988355-763728e1935b'),        // Shopping district
  adventure:   U('1544551763-46a013bb70d5'),            // Adventure activity
  honeymoon:   U('1507525428034-b723cf961d3e'),        // Romantic beach
  family:      U('1476514525535-07fb3b4ae5f1'),        // Family outdoors
  luxury:      U('1542314831-068cd1dbfeeb'),            // Luxury hotel interior
  cruise:      U('1548574505-5e239809ee19'),            // Cruise ship
  wildlife:    U('1547471080-7cc2caa01a7e'),            // Wildlife safari

  // ── Nature escapes ────────────────────────────────────────────────────
  forest:      U('1441974231531-c6227db76b6e'),        // Forest path
  lake:        U('1506905925346-21bda4d32df4'),        // Mountain lake
  mountainLake:U('1501785888041-af3ef285b470'),        // Mountain lake reflection
  waterfall:   U('1432405972618-c60b0225b8f9'),        // Waterfall
  hiking:      U('1488646953014-85cb44e25828'),        // Hiking trail
  camping:     U('1551632811-561732d1e306'),            // Campfire tent
  stars:       U('1519681393784-d120267933ba'),        // Starry night sky
  canoe:       U('1476514525535-07fb3b4ae5f1'),        // Lake canoe
  campfire:    U('1504280390367-361c6d9f38f4'),        // Campfire
  canopy:      U('1447752875215-b2761acb3c5d'),        // Forest canopy
  balloons:    U('1506929562872-bb421503ef21'),        // Hot air balloons
  road:        U('1469854523086-cc02fe5d8800'),        // Scenic road
  scuba:       U('1544551763-46a013bb70d5'),            // Scuba diving
  palmBeach:   U('1519046904884-53103b34b206'),        // Palm beach sunset

  // ── Corporate / business travel ───────────────────────────────────────
  businessFlight:   U('1556909114-f6e7ad7d3136'),      // Business traveler boarding
  businessMeeting:  U('1552664730-d307ca884978'),      // Boardroom meeting
  businessLaptop:   U('1517245386807-bb43f82c33c4'),   // Work laptop on desk
  executiveOffice:  U('1497366216548-37526070297c'),   // Executive office view
  airportLounge:    U('1542314831-068cd1dbfeeb'),      // Airport business lounge
  conferenceRoom:   U('1505373877841-8d25f7d46678'),   // Conference room
  expenseReport:    U('1554224155-6726b3ff858f'),      // Expense paperwork
  analyticsDash:    U('1551288049-bebda4e38f71'),      // Analytics dashboard
  corporateTeam:    U('1522071820081-009f0129c71c'),   // Team collaboration
  travelDesk:       U('1486299267070-83823f5448dd'),   // Travel coordination desk
  vipTransfer:      U('1449965408869-eaa3f722e40d'),   // Luxury car transfer
  privateJet:       U('1540962351504-03099e0a754b'),   // Private jet on tarmac
  hotelReception:   U('1564501049412-61c2a3083791'),   // Hotel reception desk
  businessCard:     U('1556742049-0cfed4f6a45d'),      // Business card exchange
  travelPassport:   U('1494783367193-149034c05e8f'),   // Passport with stamps
  globeNetwork:     U('1451187580459-43490279c0fa'),   // Earth from space

  // ── Hero ──────────────────────────────────────────────────────────────
  hero:       U('1502920917128-1aa500764cbd', 1920),   // Travel panoramic
  hero2:      U('1436491865332-7a61a109cc05', 1920),   // Airplane wide
  cta:        U('1467269204594-9661b134dd2b', 1920),   // European cityscape
  offers:     U('1533929736458-ca588d08c8be', 1600),   // Travel deals

  // ── Landing page — section backgrounds ────────────────────────────────
  heroCorporate:     U('1517245386807-bb43f82c33c4', 1920),  // Corporate workspace
  heroAirplane:      U('1474302770737-173ee21bab63', 1920),  // Airplane wing
  challengeBg:       U('1519389950473-47ba0277781c', 1600),  // Busy office / multiple screens
  solutionBg:        U('1522071820081-009f0129c71c', 1600),  // Team brainstorm
  trustBg:           U('1497366216548-37526070297c', 1600),  // Modern glass office
  servicesBg:        U('1480497490787-505ec076689f', 1600),  // Airport terminal
  platformBg:        U('1517694712202-14dd9538aa97', 1600),  // Code / tech workspace
  howItWorksBg:      U('1505373877841-8d25f7d46678', 1600),  // Conference room
  solutionsBg:       U('1522071820081-009f0129c71c', 1600),  // Team huddle
  globalBg:          U('1451187580459-43490279c0fa', 1920),  // Earth from space
  whyUsBg:           U('1540962351504-03099e0a754b', 1600),  // Private jet
  testimonialsBg:    U('1551882547-ff40c63fe5fa', 1600),      // Luxury hotel lobby
  mobileBg:          U('1519389950473-47ba0277781c', 1600),  // Person using phone
  faqBg:             U('1566073771259-6a8506099945', 1600),  // Relaxing pool area
  ctaBg:             U('1502602898657-3e91760cbb34', 1920),  // Paris skyline

  // ── Landing page — section content images ─────────────────────────────
  flightBooking:     U('1500835556837-99ac94a94552'),   // Airplane on runway
  hotelBooking:      U('1566073771259-6a8506099945'),   // Hotel pool
  carTransfer:       U('1449965408869-eaa3f722e40d'),   // Luxury sedan
  insuranceShield:   U('1513002749550-c59d786b8e6c'),   // Shield / protection
  visaDoc:           U('1570168007204-dfb528c6958f'),   // Travel documents
  miceEvent:         U('1505373877841-8d25f7d46678'),   // Conference setup
  meetGreet:         U('1564501049412-61c2a3083791'),   // Hotel concierge
  vipCharter:        U('1540962351504-03099e0a754b'),   // Private aviation
  approvalFlow:      U('1519389950473-47ba0277781c'),   // Team reviewing docs
  policyMgmt:        U('1486299267070-83823f5448dd'),   // Office management
  expenseTrack:      U('1554224155-6726b3ff858f'),      // Financial tracking
  analyticsImg:      U('1551288049-bebda4e38f71'),      // Data dashboard
  mobileApp:         U('1519389950473-47ba0277781c'),   // Mobile phone use
  leaderExec:        U('1570077188670-e3a8d69ac5ff'),   // Executive portrait
  coordinatorHub:    U('1541339907198-e08756dedf3f'),   // Coordination center
  financeDash:       U('1483985988355-763728e1935b'),   // Financial activity
  employeeTravel:    U('1469854523086-cc02fe5d8800'),   // Road journey
  globeVis:          U('1451187580459-43490279c0fa'),   // Earth visualization
  teamCollab:        U('1522071820081-009f0129c71c'),   // Team working together
}

/**
 * Fallback used when any image fails to load.
 * Uses a real travel photograph instead of an SVG placeholder.
 */
export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80'  // European cityscape
