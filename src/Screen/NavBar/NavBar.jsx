import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import NavbarStyles from "./Navbar.module.css";

const Navbar = ({}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleNavBarButtonClick = (item) => {
    switch (item) {
      case "Home":
        navigate("/home");
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
      case "Login":
        navigate("/login");
        console.log("Navigating to login");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <nav className={NavbarStyles.navbar}>
      <div className={NavbarStyles.navbarContainer}>
        <div className={NavbarStyles.navbarLogoContainer}>
          <img
            src="https://images.unsplash.com/photo-1611162616475-46b635cb6868"
            alt="Logo"
            className={NavbarStyles.navbarLogo}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1611162616475-46b635cb6868";
            }}
          />
        </div>
        <div className={NavbarStyles.navbarButtonContainer}>
          {["Home", "Movies", "TV Shows", "My List", "Login"].map((item) => (
            <button
              key={item}
              onClick={() => handleNavBarButtonClick(item)}
              className={NavbarStyles.navbarButton}
            >
              {item}
            </button>
          ))}
        </div>
        <div className={NavbarStyles.navbarMenuIconContainer}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className={NavbarStyles.navbarButton}
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>
      {showMenu && (
        <div className={NavbarStyles.navbarMenu}>
          {["Home", "Movies", "TV Shows", "My List", "Login"].map((item) => (
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;