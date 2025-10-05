import logo from 'assests/logos/stay_booker_logo.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import HamburgerMenu from 'components/hamburger-menu/HamburgerMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from 'contexts/AuthContext';
import { useContext } from 'react';
import NavbarItems from 'components/navbar-items/NavbarItems';

const GlobalNavbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const onHamburgerMenuToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="sticky top-0 z-50 flex flex-wrap justify-between items-center px-4 md:px-12 py-3 global-navbar__container bg-brand brand-divider-bottom shadow-lg transition-all duration-300">
      <div className="flex items-center">
        <Link
          to="/"
          className="hover:opacity-90 transition-opacity duration-200"
        >
          <img src={logo} alt="site logo" className="site-logo__img h-10" />
        </Link>
      </div>
      <ul className="list-none hidden md:flex space-x-8">
        <NavbarItems isAuthenticated={isAuthenticated} />
      </ul>
      <button
        data-testid="menu-toggle__button"
        className="block md:hidden p-2 hover:bg-brand-secondary rounded-lg transition-colors duration-200"
        onClick={onHamburgerMenuToggle}
      >
        <FontAwesomeIcon icon={faBars} size="2x" color="#fff" />
      </button>
      <HamburgerMenu
        isVisible={isVisible}
        onHamburgerMenuToggle={onHamburgerMenuToggle}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default GlobalNavbar;
