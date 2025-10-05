import {
  faLocationDot,
  faPerson,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import DateRangePicker from 'components/ux/data-range-picker/DateRangePicker';
import Input from 'components/ux/input/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * GlobalSearchBox Component
 * Renders a search box with input fields for location, number of guests, and a date range picker.
 * It includes a search button to trigger the search based on the entered criteria.
 *
 * @param {Object} props - Props for the component.
 * @param {string} props.locationInputValue - The current value of the location input.
 * @param {string} props.numGuestsInputValue - The current value of the number of guests input.
 * @param {boolean} props.isDatePickerVisible - Flag to control the visibility of the date picker.
 * @param {Function} props.onLocationChangeInput - Callback for location input changes.
 * @param {Function} props.onNumGuestsInputChange - Callback for number of guests input changes.
 * @param {Function} props.onDatePickerIconClick - Callback for the date picker icon click event.
 * @param {Array} props.locationTypeheadResults - Results for the location input typeahead.
 * @param {Function} props.onSearchButtonAction - Callback for the search button click event.
 * @param {Function} props.onDateChangeHandler - Callback for handling date range changes.
 * @param {Function} props.setisDatePickerVisible - Callback to set the visibility state of the date picker.
 * @param {Object} props.dateRange - The selected date range.
 */
const GlobalSearchBox = (props) => {
  const {
    locationInputValue,
    numGuestsInputValue,
    isDatePickerVisible,
    onLocationChangeInput,
    onNumGuestsInputChange,
    onDatePickerIconClick,
    locationTypeheadResults,
    onSearchButtonAction,
    onDateChangeHandler,
    setisDatePickerVisible,
    dateRange,
  } = props;
  return (
    <div className="flex flex-wrap flex-col lg:flex-row gap-4 p-6 bg-white rounded-xl shadow-lg hero-content__search-box">
      <div className="flex-1 min-w-[200px]">
        <Input
          size="sm"
          value={locationInputValue}
          typeheadResults={locationTypeheadResults}
          icon={faLocationDot}
          onChangeInput={onLocationChangeInput}
          className="w-full"
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <DateRangePicker
          isDatePickerVisible={isDatePickerVisible}
          onDatePickerIconClick={onDatePickerIconClick}
          onDateChangeHandler={onDateChangeHandler}
          setisDatePickerVisible={setisDatePickerVisible}
          dateRange={dateRange}
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <Input
          size="sm"
          value={numGuestsInputValue}
          onChangeInput={onNumGuestsInputChange}
          placeholder="No. of guests"
          icon={faPerson}
          type="number"
          className="w-full"
        />
      </div>
      <button
        className="flex items-center justify-center gap-2 w-full lg:w-auto bg-brand-secondary hover:bg-brand-secondary/90 px-6 py-3 text-white font-medium rounded-lg transition-colors duration-200"
        onClick={onSearchButtonAction}
      >
        <FontAwesomeIcon icon={faSearch} />
        <span>SEARCH</span>
      </button>
    </div>
  );
};

export default GlobalSearchBox;
