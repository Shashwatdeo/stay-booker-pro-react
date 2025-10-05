import express from 'express';
import { createBooking, getBookings } from '../controllers/Booking.controller.js';
import { getHotels, getNearbyHotels, getHotelByCode } from '../controllers/Hotel.controller.js';
import { confirmPayment } from '../controllers/Payment.controller.js';

const router = express.Router();

/* GET home page. */
router.get('/', (_req, res) => {
    res.json({ message: 'express JSON' });
});

router.post('/payments/confirmation', confirmPayment);
router.post('/bookings', createBooking);
router.get('/bookings', getBookings);
router.get('/hotels', getHotels);
router.get('/nearbyHotels', getNearbyHotels);

router.get('/hotels/cities', (_req, res) => {
    res.json({ elements: ['pune', 'mumbai', 'bangalore'] });
});

router.get('/hotels/verticalFilters', (_req, res) => {
    res.json({ elements: [
        {
            filterId: 'star',
            title: 'Star ratings',
            filters: [
                { id: 1, title: '5 Star', value: '5', isSelected: false },
                { id: 2, title: '4 Star', value: '4', isSelected: false },
                { id: 3, title: '3 Star', value: '3', isSelected: false }
            ]
        },
        {
            filterId: 'amenities',
            title: 'Property type',
            filters: [
                { id: 4, title: 'Hotel', value: 'Hotel', isSelected: false },
                { id: 5, title: 'Apartment', value: 'Apartment', isSelected: false },
                { id: 6, title: 'Villa', value: 'Villa', isSelected: false }
            ]
        }
    ] });
});

// Must appear after specific /hotels/* routes like /hotels/cities and /hotels/verticalFilters
router.get('/hotels/:hotelCode', getHotelByCode);

export default router;
