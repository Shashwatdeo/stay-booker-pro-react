import Hotel from '../models/Hotel.model.js';

export const getHotels = async (req, res) => {
  try {
    const { filters, currentPage = 1, advancedFilters } = req.query;

    // Load all hotels, then apply filtering/sorting in JS to handle string fields
    let list = await Hotel.find().lean();

    // Apply filters
    if (filters) {
      try {
        const parsed = JSON.parse(filters);

        if (parsed.city) {
          const city = String(parsed.city).toLowerCase();
          list = list.filter((h) => String(h.city || '').toLowerCase() === city);
        }

        // Star ratings: values like '5','4','3' → match Math.floor(rating)
        if (Array.isArray(parsed.star) && parsed.star.length > 0) {
          const stars = parsed.star.map((s) => parseInt(s, 10));
          list = list.filter((h) => {
            const r = parseFloat(h.ratings || '0');
            return stars.includes(Math.floor(r));
          });
        }

        // Amenities/Property type: if provided, match any in benefits
        if (Array.isArray(parsed.amenities) && parsed.amenities.length > 0) {
          list = list.filter((h) =>
            Array.isArray(h.benefits) && parsed.amenities.some((a) => h.benefits.includes(a))
          );
        }
      } catch (e) {
        console.error('Error parsing filters:', e);
      }
    }

    // Sorting
    let sortBy = null;
    if (advancedFilters) {
      try {
        const adv = JSON.parse(advancedFilters);
        sortBy = adv?.[0]?.sortBy || null;
      } catch (e) {
        console.error('Error parsing advancedFilters:', e);
      }
    }

    if (sortBy === 'priceLowToHigh') {
      list = list.slice().sort((a, b) => toNum(a.price) - toNum(b.price));
    } else if (sortBy === 'priceHighToLow') {
      list = list.slice().sort((a, b) => toNum(b.price) - toNum(a.price));
    }

    // Pagination
    const pageSize = 6;
    const totalResults = list.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
    const page = Math.max(1, Math.min(parseInt(currentPage, 10) || 1, totalPages));
    const hotels = list.slice((page - 1) * pageSize, page * pageSize);

    res.status(200).json({
      hotels,
      metadata: { totalResults },
      paging: { currentPage: page, totalPages, pageSize },
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: error.message });
  }
};

function toNum(v) {
  if (v == null) return 0;
  const n = parseFloat(String(v).replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}

export const getNearbyHotels = async (_req, res) => {
  try {
    const hotels = await Hotel.find().limit(6);
    res.status(200).json({ hotels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHotelByCode = async (req, res) => {
  try {
    const { hotelCode } = req.params;
    const code = isNaN(Number(hotelCode)) ? hotelCode : Number(hotelCode);
    const hotel = await Hotel.findOne({ hotelCode: code }).lean();
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};