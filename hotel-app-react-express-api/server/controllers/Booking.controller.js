import Booking from '../models/Booking.model.js';

export const createBooking = async (req, res) => {
    try {
        const { userId, hotelName, checkInDate, checkOutDate, guests, status } = req.body;
        const newBooking = new Booking({ userId, hotelName, checkInDate, checkOutDate, guests, status });
        const booking = await newBooking.save();
        res.status(201).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('userId');
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};