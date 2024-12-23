import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import NavbarStyles from "./Navbar.module.css";

const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleNavBarButtonClick = (item) => {
    switch (item) {
      case "Movies":
        navigate("/movies");
        break;
      case "TV Shows":
        navigate("/tvshows");
        break;
      case "Show Times":
        navigate("/show");
        break;
      case "Group":
        navigate("/group");
        break;
      case "Profile List":
        navigate("/profilelist");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className={NavbarStyles.navbar}>
      <div className={NavbarStyles.navbarContainer}>
        {/* Logo */}
        <div className={NavbarStyles.navbarLogoContainer}>
          <img
            src="https://images.unsplash.com/photo-1611162616475-46b635cb6868"
            alt="Logo"
            className={NavbarStyles.navbarLogo}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1611162616475-46b635cb6868";
            }}
            onClick={() => navigate("/")}
          />
        </div>

        {/* Navigation Buttons */}
        <div className={NavbarStyles.navbarButtonContainer}>
          {["Movies", "TV Shows", "Show Times", "Group", "Profile List"].map((item) => (
            <button
              key={item}
              onClick={() => handleNavBarButtonClick(item)}
              className={NavbarStyles.navbarButton}
            >
              {item}
            </button>
          ))}
          {isLoggedIn ? (
            <button
              className={`${NavbarStyles.navbarButton} ${NavbarStyles.navbarAuthButton}`}
              onClick={handleProfileClick}
            >
              Profile
            </button>
          ) : (
            <button
              className={`${NavbarStyles.navbarButton} ${NavbarStyles.navbarAuthButton}`}
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className={NavbarStyles.navbarMenuIconContainer}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className={NavbarStyles.navbarButton}
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className={NavbarStyles.navbarMenu}>
          {["Movies", "TV Shows", "Show Times", "Group", "Profile List"].map((item) => (
            <button
              key={item}
              onClick={() => {
                handleNavBarButtonClick(item);
                setShowMenu(false);
              }}
              className={NavbarStyles.navbarMenuItem}
            >
              {item}
            </button>
          ))}
          {isLoggedIn ? (
            <button
              className={`${NavbarStyles.navbarButton} ${NavbarStyles.navbarAuthButton}`}
              onClick={handleProfileClick}
            >
              Profile
            </button>
          ) : (
            <button
              className={`${NavbarStyles.navbarButton} ${NavbarStyles.navbarAuthButton}`}
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
