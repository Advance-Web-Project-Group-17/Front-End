import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaBars } from "react-icons/fa"; // Importing the menu icon
import NavbarStyles from "./Navbar.module.css";

const Navbar = ({setShowMenu, showMenu}) => {
    const handleNavBarButtonClick = (item) => {
        const navigate = Navigate();
        switch (item) {
          case "Home":
            <Link to="/home"/>;
            break;
          case "Movies":
            navigate("/movies");
            break;
          case "TV Shows":
            navigate("/tvshows");
            break;
          case "My List":
            navigate("/mylist");
            break;
          case "Profile":
            navigate("/profile");
            break;
          default:
            navigate("/home");
            break;
        }
      };
  return (
    <nav className={NavbarStyles.navbar}>
      <div className={NavbarStyles.navbarContainer}>
        {/* Logo Section */}
        <div className={NavbarStyles.navbarLogoContainer}>
          <img
            src="https://images.unsplash.com/photo-1611162616475-46b635cb6868"
            alt="Logo"
            className={NavbarStyles.navbarLogo}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1611162616475-46b635cb6868"; // Fallback image
            }}
          />
        </div>

        {/* Button Section */}
        <div className={NavbarStyles.navbarButtonContainer}>
          {["Home", "Movies", "TV Shows", "My List", "Profile"].map((item) => (
            <button
              key={item}
              onClick={() => handleNavBarButtonClick(item)}
              className={NavbarStyles.navbarButton}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Mobile Menu Icon */}
        <div className={NavbarStyles.navbarMenuIconContainer}>
          <button
            onClick={() => setShowMenu((prev) => !prev)} // Toggle menu visibility
            className={NavbarStyles.navbarButton}
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Section */}
      {showMenu && (
        <div className={NavbarStyles.navbarMenu}>
          {["Home", "Movies", "TV Shows", "My List", "Profile"].map((item) => (
            <button
              key={item}
              onClick={() => {
                handleNavBarButtonClick(item); // Trigger button click action
                setShowMenu(false); // Close the menu after navigation
              }}
              className={NavbarStyles.navbarMenuItem}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
