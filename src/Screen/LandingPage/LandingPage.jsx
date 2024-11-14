import React, { useState, useEffect } from "react";
import { FaBars, FaPlay, FaStar, FaTimes } from "react-icons/fa";
import NavbarStyles from "./Navbar.module.css";
import MovieGridStyles from "./MovieGrid.module.css";
import FeaturedMovieStyles from "./FeaturedMovie.module.css";
import LandingPageStyles from "./LandingPage.module.css";

// Sample movies data
const movies = [
  {
    id: 1,
    title: "Inception",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1",
    rating: 8.8,
    genres: ["Action", "Sci-Fi"],
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology."
  },
  {
    id: 2,
    title: "The Dark Knight",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
    rating: 9.0,
    genres: ["Action", "Drama"],
    synopsis: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc on Gotham."
  },
  {
    id: 3,
    title: "Interstellar",
    image: "https://images.unsplash.com/photo-1506466010722-395aa2bef877",
    rating: 8.6,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  // Add more movies here
];

const LandingPage = () => {
  const [currentView, setCurrentView] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Slideshow logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const toggleMenu = () => { setMenuOpen(!menuOpen); };

  return (
    <div className={LandingPageStyles.container}>
      <Navbar />
      <div className={LandingPageStyles.pageContent}>
        {currentView === "home" && (
          <>
            {/* Pass currentImageIndex to FeaturedMovie */}
            <FeaturedMovie currentImageIndex={currentImageIndex} />
            <MovieGrid handleMovieClick={handleMovieClick} />
          </>
        )}
      </div>
      {showModal && <MovieModal movie={selectedMovie} onClose={() => setShowModal(false)} />}
    </div>
  );
};

// Navbar component
const Navbar = ({setCurrentView, setShowMenu, showMenu}) => (
    <nav className={NavbarStyles.navbar}>
    <div className={NavbarStyles.navbarContainer}>
      <div className={NavbarStyles.navbarLogoContainer}>
        <img
          src="https://images.unsplash.com/photo-1611162616475-46b635cb6868"
          alt="Logo"
          className={NavbarStyles.navbarLogo}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1611162616475-46b635cb6868';
          }}
        />
      </div>
      <div className={NavbarStyles.navbarButtonContainer}>
        {["Home", "Movies", "TV Shows", "My List", "Profile"].map((item) => (
          <button
            key={item}
            onClick={() => setCurrentView(item.toLowerCase())}
            className={NavbarStyles.navbarButton}
          >
            {item}
          </button>
        ))}
      </div>
      <div className={NavbarStyles.navbarMenuIconContainer}>
        <button onClick={() => setShowMenu(!showMenu)} className={NavbarStyles.navbarButton}>
          <FaBars size={24} />
        </button>
      </div>
    </div>
    {showMenu && (
      <div className={NavbarStyles.navbarMenu}>
        <div className="flex flex-col space-y-4">
          {["Home", "Movies", "TV Shows", "My List", "Profile"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setCurrentView(item.toLowerCase());
                setShowMenu(false);
              }}
              className={NavbarStyles.navbarMenuItem}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    )}
  </nav>
);

// FeaturedMovie component
const FeaturedMovie = ({ currentImageIndex }) => {
  const movie = movies[currentImageIndex];

  // Ensure movie exists before rendering
  if (!movie) return null;

  return (
    <div className={FeaturedMovieStyles.container}>
      <div className={FeaturedMovieStyles.carouselImage}>
        {movies.map((movie, index) => (
          <img
            key={movie.id}
            src={movie.image}
            alt={movie.title}
            className={`${FeaturedMovieStyles.image} ${index === currentImageIndex ? FeaturedMovieStyles.opacityVisible : FeaturedMovieStyles.opacityHidden}`}
          />
        ))}
      </div>
      <div className={FeaturedMovieStyles.gradientOverlay}>
        <div className={FeaturedMovieStyles.contentWrapper}>
          <div className={FeaturedMovieStyles.textContent}>
            <h1 className={FeaturedMovieStyles.title}>{movie.title}</h1>
            <p className={FeaturedMovieStyles.synopsis}>{movie.synopsis}</p>
            <button className={FeaturedMovieStyles.button}>
              <FaPlay className={FeaturedMovieStyles.buttonIcon} />
              <span>Watch Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// MovieGrid component
const MovieGrid = ({ handleMovieClick }) => (
  <div className={MovieGridStyles.container}>
    <h2 className={MovieGridStyles.title}>Trending Movies</h2>
    <div className={MovieGridStyles.grid}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} handleMovieClick={handleMovieClick} />
      ))}
    </div>
  </div>
);

// MovieCard component
const MovieCard = ({ movie, handleMovieClick }) => (
  <div className={MovieGridStyles.card} onClick={() => handleMovieClick(movie)}>
    <img src={movie.image} alt={movie.title} className={MovieGridStyles.cardImage} />
    <div className={MovieGridStyles.cardOverlay}>
      <div className={MovieGridStyles.cardTitle}>{movie.title}</div>
      <div className={MovieGridStyles.cardDetails}>
        <div className={MovieGridStyles.rating}>
          <FaStar /> {movie.rating}
        </div>
        <div className={MovieGridStyles.genre}>
          {movie.genres.join(", ")}
        </div>
      </div>
    </div>
  </div>
);

// MovieModal component
const MovieModal = ({ movie, onClose }) => {
    if (!movie) return null;
  
    return (
      <div className={LandingPageStyles.modal}>
        <div className={LandingPageStyles.modalContent}>
          {/* Close button */}
          <button className={LandingPageStyles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>  
          <div className={LandingPageStyles.modalHeader}>
            <h2 className={LandingPageStyles.modalTitle}>{movie.title}</h2>
            <div className={LandingPageStyles.modalRating}>
              <FaStar /> {movie.rating}
            </div>
          </div>
  
          <div className={LandingPageStyles.modalBody}>
            <img src={movie.image} alt={movie.title} className={LandingPageStyles.modalImage} />
            <p className={LandingPageStyles.modalSynopsis}>{movie.synopsis}</p>
          </div>
        </div>
      </div>
    );
  };
  

export default LandingPage;
