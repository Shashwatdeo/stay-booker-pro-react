import { createServer, Model, Response } from 'miragejs';
import hotelsData from './data/hotels.json';
import countriesData from './data/countries.json';

export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      booking: Model,
      // Define other models here if needed
    },

    seeds(server) {
      // If localStorage has persisted users, load them into the Mirage DB so
      // created users survive page reloads during development.
      const persisted = typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('mirage_users');
      if (persisted) {
        try {
          const users = JSON.parse(persisted);
          users.forEach((u) => {
            server.create('user', { ...u });
          });
        } catch (e) {
          // fallback to default seeds if parsing fails
        }
      }

      // if no users were loaded from localStorage, create default seed users
      if (server.schema.users.all().length === 0) {
        server.create('user', {
          id: '1',
          email: 'user1@example.com',
          password: 'password1',
          firstName: 'John',
          lastName: 'Doe',
          fullName: 'John Doe',
          phone: '1234567890',
          country: 'USA',
          isPhoneVerified: true,
          isEmailVerified: true,
        });
        server.create('user', {
          id: '2',
          email: 'user2@example.com',
          password: 'password2',
          firstName: 'Jane',
          lastName: 'Doe',
          fullName: 'Jane Doe',
          phone: '0987654321',
          country: 'UK',
          isPhoneVerified: false,
          isEmailVerified: true,
        });
        // persist default seeds for future sessions
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const all = server.schema.users.all().models.map((m) => m.attrs);
            window.localStorage.setItem('mirage_users', JSON.stringify(all));
          } catch (e) {}
        }
      }

      // Load persisted bookings from localStorage (if any)
      const persistedBookings = typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('mirage_bookings');
      if (persistedBookings) {
        try {
          const bookings = JSON.parse(persistedBookings);
          bookings.forEach((b) => {
            server.create('booking', { ...b });
          });
        } catch (e) {
          // ignore parse errors
        }
      }
    },

    routes() {
      // ensure mirage can match absolute URLs (requests with window.location.origin)
      // so that requests built as absolute (e.g. http://localhost:3000/api/...) match correctly
      if (typeof window !== 'undefined' && window.location && window.location.origin) {
        this.urlPrefix = window.location.origin;
      }
      this.namespace = 'api';

      // Add a logged-in user state to the server
      let loggedInUser = null;

      this.passthrough('http://localhost:4000/*');

      this.get('/users/auth-user', () => {
        if (loggedInUser) {
          return new Response(
            200,
            {},
            {
              errors: [],
              data: {
                isAuthenticated: true,
                userDetails: {
                  id: loggedInUser.id,
                  firstName: loggedInUser.firstName,
                  lastName: loggedInUser.lastName,
                  fullName: loggedInUser.fullName,
                  email: loggedInUser.email,
                  phone: loggedInUser.phone,
                  country: loggedInUser.country,
                  isPhoneVerified: loggedInUser.isPhoneVerified,
                  isEmailVerified: loggedInUser.isEmailVerified,
                },
              },
            }
          );
        } else {
          return new Response(
            200,
            {},
            {
              errors: [],
              data: {
                isAuthenticated: false,
                userDetails: {},
              },
            }
          );
        }
      });

      this.post('/users/login', (schema, request) => {
        const body = JSON.parse(request.requestBody || '{}');
        const rawEmail = body.email;
        const password = body.password;
        const email = rawEmail && rawEmail.trim().toLowerCase();
        if (!email) {
          return new Response(400, {}, { message: 'Email is required' });
        }
        const user = schema.users.findBy({ email });
        if (!user || user.password !== password) {
          return new Response(404, {}, { message: 'User not found or invalid credentials' });
        }
        loggedInUser = user.attrs;
        const token = 'fake-jwt-token';
        return new Response(200, {}, { data: { user: user.attrs, token } });
      });

      this.post('/users/logout', (_schema, _request) => {
        loggedInUser = null;
        return new Response(200, {}, { data: { message: 'Logged out' } });
      });

      this.put('/users/register', (schema, request) => {
        const attrs = JSON.parse(request.requestBody || '{}');
        const email = attrs.email && attrs.email.trim().toLowerCase();
        if (!email) {
          return new Response(400, {}, { message: 'Email is required' });
        }
        const existing = schema.users.findBy({ email });
        if (existing) {
          return new Response(409, {}, { message: 'User already exists' });
        }
        const normalized = { ...attrs, email };
        const user = schema.users.create(normalized);

        // persist to localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const all = schema.users.all().models.map((m) => m.attrs);
            window.localStorage.setItem('mirage_users', JSON.stringify(all));
          } catch (e) {}
        }

        return new Response(201, {}, { data: { user: user.attrs } });
      });

      this.patch('/users/update-profile', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ email: loggedInUser.email });

        if (user) {
          user.update(attrs);
          return new Response(
            200,
            {},
            {
              errors: [],
              data: {
                status: 'Profile updated successfully',
              },
            }
          );
        } else {
          return new Response(
            404,
            {},
            {
              errors: ['User not found'],
              data: {},
            }
          );
        }
      });

      this.get('/users/bookings', (schema, request) => {
        // If we have a loggedInUser, filter bookings by userId, otherwise return all bookings
        let bookings = schema.bookings.all().models.map((m) => m.attrs);
        if (loggedInUser) {
          bookings = bookings.filter((b) => String(b.userId) === String(loggedInUser.id) || b.userId === loggedInUser.id);
        }
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: bookings,
            },
          }
        );
      });

      // Create booking endpoint - persist to Mirage schema and localStorage
      this.post('/bookings', (schema, request) => {
        try {
          const attrs = JSON.parse(request.requestBody || '{}');
          // ensure bookingId and bookingDate are set
          const bookingId = attrs.bookingId || `BKG${Date.now().toString().slice(-6)}`;
          const bookingDate = attrs.bookingDate || new Date().toISOString().split('T')[0];
          // associate booking with loggedInUser when possible
          const userId = attrs.userId || (loggedInUser && loggedInUser.id) || 1;
          const booking = schema.bookings.create({ ...attrs, bookingId, bookingDate, userId });

          // persist bookings to localStorage
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              const all = schema.bookings.all().models.map((m) => m.attrs);
              window.localStorage.setItem('mirage_bookings', JSON.stringify(all));
            } catch (e) {}
          }

          return new Response(201, {}, { data: booking.attrs });
        } catch (e) {
          return new Response(500, {}, { errors: ['Failed to create booking'] });
        }
      });

      this.get('/users/payment-methods', () => {
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: [
                {
                  id: '1',
                  cardType: 'Visa',
                  cardNumber: '**** **** **** 1234',
                  expiryDate: '08/26',
                },
                {
                  id: '2',
                  cardType: 'MasterCard',
                  cardNumber: '**** **** **** 5678',
                  expiryDate: '07/24',
                },
                {
                  id: '3',
                  cardType: 'American Express',
                  cardNumber: '**** **** **** 9012',
                  expiryDate: '05/25',
                },
              ],
            },
          }
        );
      });

      this.get('/hotel/:hotelId/booking/enquiry', (_schema, request) => {
        let hotelId = request.params.hotelId;
        const result = hotelsData.find((hotel) => {
          return Number(hotel.hotelCode) === Number(hotelId);
        });
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              name: result.title,
              cancellationPolicy: 'Free cancellation 1 day prior to stay',
              checkInTime: '12:00 PM',
              checkOutTime: '10:00 AM',
              currentNightRate: result.price,
              maxGuestsAllowed: 5,
              maxRoomsAllowedPerGuest: 3,
            },
          }
        );
      });

      this.get('/popularDestinations', () => {
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: [
                {
                  code: 1211,
                  name: 'Mumbai',
                  imageUrl: '/images/cities/mumbai.jpg',
                },
                {
                  code: 1212,
                  name: 'Bangkok',
                  imageUrl: '/images/cities/bangkok.jpg',
                },
                {
                  code: 1213,
                  name: 'London',
                  imageUrl: '/images/cities/london.jpg',
                },
                {
                  code: 1214,
                  name: 'Dubai',
                  imageUrl: '/images/cities/dubai.jpg',
                },
                {
                  code: 1215,
                  name: 'Oslo',
                  imageUrl: '/images/cities/oslo.jpg',
                },
              ],
            },
          }
        );
      });

      this.get('/nearbyHotels', () => {
        const hotels = hotelsData.filter((hotel) => {
          return hotel.city === 'pune';
        });
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: hotels,
            },
          }
        );
      });

      this.get('/hotel/:hotelId', (_schema, request) => {
        let hotelId = request.params.hotelId;
        const description = [
          'A serene stay awaits at our plush hotel, offering a blend of luxury and comfort with top-notch amenities.',
          'Experience the pinnacle of elegance in our beautifully designed rooms with stunning cityscape views.',
          'Indulge in gastronomic delights at our in-house restaurants, featuring local and international cuisines.',
          'Unwind in our state-of-the-art spa and wellness center, a perfect retreat for the senses.',
          'Located in the heart of the city, our hotel is the ideal base for both leisure and business travelers.',
        ];

        const result = hotelsData.find((hotel) => {
          return Number(hotel.hotelCode) === Number(hotelId);
        });

        result.description = description;

        return new Response(
          200,
          {},
          {
            errors: [],
            data: result,
          }
        );
      });

      this.get('/hotel/:hotelId/reviews', (_schema, request) => {
        // hardcoded hotelId for now so to not add mock for each hotel
        const currentPage = request.queryParams.currentPage;
        let hotelId = 71222;
        const result = hotelsData.find((hotel) => {
          return Number(hotel.hotelCode) === Number(hotelId);
        });
        const totalRatings = result.reviews.data.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const initialCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        const starCounts = result.reviews.data.reduce((acc, review) => {
          const ratingKey = Math.floor(review.rating).toString();
          if (acc.hasOwnProperty(ratingKey)) {
            acc[ratingKey]++;
          }
          return acc;
        }, initialCounts);

        const metadata = {
          totalReviews: result.reviews.data.length,
          averageRating: (totalRatings / result.reviews.data.length).toFixed(1),
          starCounts,
        };

        //paging
        const pageSize = 5;
        const paging = {
          currentPage: currentPage || 1,
          totalPages:
            Math.floor((result.reviews.data.length - 1) / pageSize) + 1,
          pageSize,
        };

        // paginated data
        const data = result.reviews.data.slice(
          (paging.currentPage - 1) * pageSize,
          paging.currentPage * pageSize
        );

        return {
          errors: [],
          data: {
            elements: data,
          },
          metadata,
          paging,
        };
      });

      this.put('/hotel/add-review', (schema, request) => {
        // const attrs = JSON.parse(request.requestBody);
        // const hotelId = attrs.hotelId;
        // const review = attrs.review;
        // const rating = attrs.rating;
        // const user = schema.users.findBy({ email: attrs.email });
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              status: 'Review added successfully',
            },
          }
        );
      });

      this.get('/hotels', (_schema, request) => {
        let currentPage = request.queryParams.currentPage;
        // allow callers to omit query params; provide safe defaults
        const filters = request.queryParams.filters || '{}';
        const parsedFilters = (() => {
          try {
            return JSON.parse(filters);
          } catch (e) {
            return {};
          }
        })();
        const parsedAdvancedFilters = (() => {
          try {
            return JSON.parse(request.queryParams.advancedFilters || '[]');
          } catch (e) {
            return [];
          }
        })();
  const cityRaw = parsedFilters.city;
  const city = typeof cityRaw !== 'undefined' && cityRaw !== null ? String(cityRaw).toLowerCase().trim() : '';
  const star_ratings = parsedFilters.star_ratings || [];
  const priceFilter = parsedFilters.priceFilter || null;
        const sortByFilter = parsedAdvancedFilters.find((filter) => {
          return filter.sortBy;
        });

        const filteredResults = hotelsData.filter((hotel) => {
          const hotelRating = parseFloat(hotel.ratings);
          const hotelPrice = parseFloat(hotel.price.replace(',', ''));
          const hotelCity = hotel.city ? String(hotel.city).toLowerCase().trim() : '';
          const isCityMatch = !city || hotelCity === city;
          const isPriceMatch =
            !priceFilter ||
            (hotelPrice >= parseFloat(priceFilter.start) &&
              hotelPrice <= parseFloat(priceFilter.end));

          if (isCityMatch && isPriceMatch) {
            if (star_ratings && star_ratings.length > 0) {
              return star_ratings.some((selectedRating) => {
                const selected = parseFloat(selectedRating);
                const range = 0.5;
                return Math.abs(hotelRating - selected) <= range;
              });
            } else {
              // If no star ratings are provided, return all hotels for the city (or all cities if city is empty)
              return true;
            }
          }
          return false;
        });

        if (sortByFilter) {
          const sortType = sortByFilter.sortBy;
          if (sortType === 'priceLowToHigh') {
            filteredResults.sort((a, b) => {
              return a.price - b.price;
            });
          }
          if (sortType === 'priceHighToLow') {
            filteredResults.sort((a, b) => {
              return b.price - a.price;
            });
          }
        }

  // debug logs to help diagnose empty results
  // eslint-disable-next-line no-console
  console.info('[Mirage] /hotels parsedFilters:', parsedFilters, 'parsedAdvancedFilters:', parsedAdvancedFilters);
  // eslint-disable-next-line no-console
  console.info('[Mirage] /hotels filteredResults length:', filteredResults.length);

        // pagination config
        const pageSize = 6;
        const totalPages =
          Math.floor((filteredResults.length - 1) / pageSize) + 1;
        currentPage = currentPage > totalPages ? totalPages : currentPage;
        const paging = {
          currentPage: currentPage || 1,
          totalPages: Math.floor((filteredResults.length - 1) / pageSize) + 1,
          pageSize,
        };

        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: filteredResults.slice(
                (paging.currentPage - 1) * pageSize,
                paging.currentPage * pageSize
              ),
            },
            metadata: {
              totalResults: filteredResults.length,
            },
            paging,
          }
        );
      });

      this.get('/availableCities', () => {
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: ['pune', 'bangalore', 'mumbai'],
            },
          }
        );
      });

      // Support the legacy endpoint used by the frontend: /hotels/cities
      this.get('/hotels/cities', () => {
        // derive city list from hotelsData and dedupe
        const cities = Array.from(new Set(hotelsData.map((h) => h.city))).filter(Boolean);
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: cities,
            },
          }
        );
      });

      this.get('/hotels/verticalFilters', () => {
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: [
                {
                  filterId: 'star_ratings',
                  title: 'Star ratings',
                  filters: [
                    {
                      id: '5_star_rating',
                      title: '5 Star',
                      value: '5',
                    },
                    {
                      id: '4_star_rating',
                      title: '4 Star',
                      value: '4',
                    },
                    {
                      id: '3_star_rating',
                      title: '3 Star',
                      value: '3',
                    },
                  ],
                },
                {
                  filterId: 'propety_type',
                  title: 'Property type',
                  filters: [
                    {
                      id: 'prop_type_hotel',
                      title: 'Hotel',
                    },
                    {
                      id: 'prop_type_apartment',
                      title: 'Apartment',
                    },
                    {
                      id: 'prop_type_villa',
                      title: 'Villa',
                    },
                  ],
                },
              ],
            },
          }
        );
      });

      this.post('/payments/confirmation', () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              new Response(
                200,
                {},
                {
                  errors: [],
                  data: {
                    status: 'Payment successful',
                    bookingDetails: [
                      {
                        label: 'Booking ID',
                        value: 'BKG123',
                      },
                      {
                        label: 'Booking Date',
                        value: '2024-01-10',
                      },
                      {
                        label: 'Hotel Name',
                        value: 'Seaside Resort',
                      },
                      {
                        label: 'Check-in Date',
                        value: '2024-01-20',
                      },
                      {
                        label: 'Check-out Date',
                        value: '2024-01-25',
                      },
                      {
                        label: 'Total Fare',
                        value: '₹14,500',
                      },
                    ],
                  },
                }
              )
            );
          }, 2000);
        });
      });

      this.get('/misc/countries', () => {
        return new Response(
          200,
          {},
          {
            errors: [],
            data: {
              elements: countriesData,
            },
          }
        );
      });
    },
  });

  return server;
}
