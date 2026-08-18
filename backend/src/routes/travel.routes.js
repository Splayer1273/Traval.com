import { Router } from 'express';
import { searchFlights, getFlight, searchHotels, getHotel } from '../controllers/travelController.js';

/**
 * Public travel inventory endpoints — search and detail for flights & hotels.
 * `/search` routes must be registered before `/:id` so "search" is never
 * treated as an id.
 */
const router = Router();

router.get('/flights/search', searchFlights);
router.get('/flights/:id', getFlight);
router.get('/hotels/search', searchHotels);
router.get('/hotels/:id', getHotel);

export default router;
