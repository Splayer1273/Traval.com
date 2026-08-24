/**
 * Central type definitions for Akbar Bizvoy domain models.
 * The app is plain JS (Vite + React), so these serve as living documentation
 * for the shapes used across data/, services/ and components/. If the project
 * migrates to TypeScript later, these map 1:1 to interfaces.
 */

/**
 * @typedef {Object} Airline
 * @property {string} id
 * @property {string} name
 * @property {string} code - 2-letter IATA-ish code used for the monogram logo
 * @property {string} color - brand color for the logo badge
 * @property {string} alliance
 * @property {number} rating
 */

/**
 * @typedef {Object} Airport
 * @property {string} code
 * @property {string} city
 * @property {string} name
 * @property {string} country
 * @property {string} terminal
 */

/**
 * @typedef {Object} Flight
 * @property {string} id
 * @property {string} flightNumber
 * @property {string} airlineId
 * @property {string} airline
 * @property {string} airlineCode
 * @property {string} airlineColor
 * @property {string} aircraft
 * @property {string} cabin
 * @property {Airport} origin
 * @property {Airport} destination
 * @property {string} departure - ISO datetime
 * @property {string} arrival - ISO datetime
 * @property {number} durationMin
 * @property {number} stops
 * @property {string|null} stopCity
 * @property {number} price - INR
 * @property {boolean} refundable
 * @property {{cabin: string, checkin: string}} baggage
 * @property {number} seatsLeft
 * @property {string} [leg]
 */

/**
 * @typedef {Object} HotelRoom
 * @property {string} id
 * @property {string} name
 * @property {string} bed
 * @property {number} guests
 * @property {string} area
 * @property {string[]} amenities
 * @property {boolean} breakfast
 * @property {boolean} refundable
 * @property {number} price - INR per night
 * @property {string} image
 */

/**
 * @typedef {Object} Hotel
 * @property {string} id
 * @property {string} name
 * @property {string} city
 * @property {string} country
 * @property {string} address
 * @property {number} star - 1..5
 * @property {number} guestRating - 0..5
 * @property {number} reviewCount
 * @property {string} description
 * @property {string[]} images
 * @property {string[]} amenities
 * @property {number} pricePerNight - INR
 * @property {number} taxPct
 * @property {string} checkIn
 * @property {string} checkOut
 * @property {HotelRoom[]} rooms
 * @property {string[]} nearby
 * @property {{lat: number, lng: number}} map
 * @property {string[]} policies
 */

/**
 * @typedef {Object} HolidayPackage
 * @property {string} id
 * @property {string} name
 * @property {string} destination
 * @property {string} country
 * @property {string} image
 * @property {string[]} images
 * @property {string} duration
 * @property {number} nights
 * @property {number} days
 * @property {number} price - INR per person
 * @property {number} rating
 * @property {number} reviews
 * @property {string[]} categories
 * @property {{flight: boolean, hotel: boolean, meals: string, visa: boolean, transfer: boolean, sightseeing: boolean}} includes
 * @property {number} activities
 * @property {string[]} highlights
 * @property {{day: number, title: string, desc: string, image: string}[]} itinerary
 */

/**
 * @typedef {Object} Destination
 * @property {string} slug
 * @property {string} city
 * @property {string} country
 * @property {string} region
 * @property {string} tagline
 * @property {string} image
 * @property {string[]} images
 * @property {number} startingPrice - INR
 * @property {number} rating
 * @property {string[]} categories
 * @property {string} bestTime
 * @property {string} description
 * @property {string[]} attractions
 * @property {string[]} thingsToDo
 * @property {string[]} tips
 * @property {{icon: string, summary: string, avgHigh: number, avgLow: number, monsoon: string}} weather
 * @property {string[]} flightRoutes - e.g. "BOM-DXB"
 * @property {string[]} hotelIds
 * @property {string[]} packageIds
 */

/**
 * @typedef {Object} Offer
 * @property {string} id
 * @property {string} type
 * @property {string} title
 * @property {string} description
 * @property {number} discount - percent (or flat rupees if > 90)
 * @property {string} promoCode
 * @property {string} expiry
 * @property {string[]} terms
 * @property {string} image
 * @property {string} [badge]
 */

/**
 * @typedef {Object} BookingPassenger
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} [gender]
 * @property {string} [dob]
 * @property {string} [nationality]
 * @property {string} [passportNumber]
 * @property {string} [passportExpiry]
 * @property {string} [seat]
 * @property {string} [type]
 * @property {string} [room]
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} pnr
 * @property {string} ref
 * @property {'flight'|'hotel'|'package'} type
 * @property {'confirmed'|'upcoming'|'completed'|'cancelled'} status
 * @property {string} title
 * @property {string} destination
 * @property {string} image
 * @property {string} bookingDate
 * @property {string} travelDate
 * @property {number} amount - INR
 * @property {string} currency
 * @property {BookingPassenger[]} passengers
 * @property {Object} summary
 * @property {{method: string, paid: number, base: number, taxes: number, refunded?: number, transactionId?: string}} payment
 * @property {{name: string, price: number}[]} addons
 * @property {{label: string, time: string, done: boolean}[]} timeline
 */

export {}
