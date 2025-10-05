import { faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from 'utils/price-helpers';

/**
 * HotelViewCard Component
 * Renders a card view for a hotel, displaying its image, title, subtitle, benefits, price, and ratings.
 * Provides a 'Book now' button to navigate to the hotel's detailed view.
 *
 * @param {Object} props - Props for the component.
 * @param {string} props.id - The unique code of the hotel.
 * @param {Object} props.image - The image object for the hotel, containing the URL and alt text.
 * @param {string} props.title - The title of the hotel.
 * @param {string} props.subtitle - The subtitle or a short description of the hotel.
 * @param {Array} props.benefits - A list of benefits or features offered by the hotel.
 * @param {string} props.price - The price information for the hotel.
 * @param {number} props.ratings - The ratings of the hotel.
 */
const HotelViewCard = (props) => {
  const {
    id: hotelCode,
    image,
    title,
    subtitle,
    benefits,
    price,
    ratings,
  } = props;
  const navigate = useNavigate();
  const onBookNowClick = () => {
    navigate(`/hotel/${hotelCode}`);
  };

  const imageUrl = image && image.imageUrl ? image.imageUrl : '/images/default-hotel.jpg';
  const imageAlt = image && image.accessibleText ? image.accessibleText : title;

  return (
    <div
      className="card border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row gap-x-4 w-full hover:shadow-lg transition-all duration-300 bg-white"
      data-testid="hotel-view-card"
    >
      <div className="cursor-pointer overflow-hidden rounded-lg">
        <Link
          to={`/hotel/${hotelCode}`}
          className="block text-slate-700 hover:text-brand transition-colors duration-300"
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            className="md:w-[220px] md:h-[140px] object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-between ml-0 md:ml-4 flex-1">
        <div>
          <Link
            to={`/hotel/${hotelCode}`}
            className="block text-slate-700 hover:text-brand transition-colors duration-300"
          >
            <h4 className="text-2xl font-bold text-slate-800 mb-2">{title}</h4>
          </Link>
          <p className="text-slate-600 text-sm mb-4">{subtitle}</p>
        </div>
        <ul className="space-y-2">
          {benefits.length > 0 &&
            benefits.map((benefit, index) => (
              <li
                className="text-green-700 font-medium text-sm flex items-center"
                key={index}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className="mr-2 text-green-500"
                />{' '}
                {benefit}
              </li>
            ))}
        </ul>
      </div>
      <div className="flex flex-col ml-0 md:ml-auto justify-between border-l-0 md:border-l-2 border-gray-200 items-stretch pl-0 md:pl-6 mt-4 md:mt-0">
        <div className="flex justify-between my-3 md:my-0 items-center md:flex-col md:justify-between w-full h-full">
          <div className="flex items-center bg-brand px-3 py-1 rounded-full">
            <span className="text-white font-medium text-sm mr-1">
              {ratings}
            </span>
            <FontAwesomeIcon icon={faStar} className="text-yellow-300" />
          </div>
          <p className="text-slate-800 font-bold text-xl whitespace-nowrap">
            ₹ {formatPrice(price)}
            <span className="text-sm text-slate-500 font-normal ml-1">
              / night
            </span>
          </p>
        </div>
        <button
          className="bg-brand-secondary hover:bg-brand-secondary/90 px-6 py-3 text-white whitespace-nowrap rounded-lg font-medium transition-colors duration-200 mt-4"
          onClick={onBookNowClick}
        >
          Book now
        </button>
      </div>
    </div>
  );
};

export default HotelViewCard;
