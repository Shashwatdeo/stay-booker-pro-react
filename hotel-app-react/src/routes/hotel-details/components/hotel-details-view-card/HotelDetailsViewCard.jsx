import HotelBookingDetailsCard from '../hotel-booking-details-card/HotelBookingDetailsCard';
import UserReviews from '../user-reviews/UserReviews';
import { networkAdapter } from 'services/NetworkAdapter';
import React, { useEffect, useState } from 'react';
import ReactImageGallery from 'react-image-gallery';

const HotelDetailsViewCard = ({ hotelDetails = {} }) => {
  // defensive: ensure hotelDetails is always an object so we never try to read properties of undefined
  const images = Array.isArray(hotelDetails.images) && hotelDetails.images.length > 0
    ? hotelDetails.images.map((image) => ({
        original: image.imageUrl,
        thumbnail: image.imageUrl,
        thumbnailClass: 'h-[80px]',
        thumbnailLoading: 'lazy',
      }))
    : [{ original: '/images/default-hotel.jpg', thumbnail: '/images/default-hotel.jpg' }];

  const [reviewData, setReviewData] = useState({
    isLoading: true,
    data: [],
  });
  const [currentReviewsPage, setCurrentReviewPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentReviewPage(page);
  };

  const handlePreviousPageChange = () => {
    setCurrentReviewPage((prev) => {
      if (prev <= 1) return prev;
      return prev - 1;
    });
  };

  const handleNextPageChange = () => {
    setCurrentReviewPage((prev) => {
      const totalPages = reviewData && reviewData.pagination && reviewData.pagination.totalPages;
      if (typeof totalPages === 'number' && prev >= totalPages) return prev;
      return prev + 1;
    });
  };

  useEffect(() => {
    // only fetch reviews when we have a valid hotelCode
    if (!hotelDetails || !hotelDetails.hotelCode) return;

    const hotelCode = hotelDetails.hotelCode;

    setReviewData({
      isLoading: true,
      data: [],
    });

    const fetchHotelReviews = async () => {
      const response = await networkAdapter.get(
        `/api/hotel/${hotelCode}/reviews`,
        {
          currentPage: currentReviewsPage,
        }
      );
      if (response && (Array.isArray(response.reviews) || (response.data && Array.isArray(response.data)))) {
        setReviewData({
          isLoading: false,
          data: response.reviews || response.data || [],
          metadata: response.metadata,
          pagination: response.paging,
        });
      }
    };
    fetchHotelReviews();
  }, [hotelDetails, currentReviewsPage]);

  return (
    <div className="flex items-start justify-center flex-wrap md:flex-nowrap container mx-auto p-4">
      <div className="w-[800px] bg-white shadow-lg rounded-lg overflow-hidden">
        <div>
          <div className="relative w-full">
            <ReactImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={false}
            />
            {hotelDetails.discount && (
              <div className="absolute top-0 right-0 m-4 px-2 py-1 bg-yellow-500 text-white font-semibold text-xs rounded">
                {hotelDetails.discount} OFF
              </div>
            )}
          </div>
          <div className="p-4">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              {hotelDetails.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {hotelDetails.subtitle}
            </p>
            <div className="mt-2 space-y-2">
              {Array.isArray(hotelDetails.description)
                ? hotelDetails.description.map((line, index) => (
                    <p key={index} className="text-gray-700">
                      {line}
                    </p>
                  ))
                : null}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm text-gray-600">
                  {Array.isArray(hotelDetails.benefits) ? hotelDetails.benefits.join(' | ') : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
        <UserReviews
          reviewData={reviewData}
          handlePageChange={handlePageChange}
          handlePreviousPageChange={handlePreviousPageChange}
          handleNextPageChange={handleNextPageChange}
        />
      </div>
      <HotelBookingDetailsCard hotelCode={hotelDetails.hotelCode} />
    </div>
  );
};

export default HotelDetailsViewCard;
