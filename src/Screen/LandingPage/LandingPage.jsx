import React, { useState, useEffect } from "react";
import { FaPlay, FaStar, FaTimes } from "react-icons/fa";
import { Navigate, Link } from "react-router-dom"
import MovieGridStyles from "./MovieGrid.module.css";
import FeaturedMovieStyles from "./FeaturedMovie.module.css";
import LandingPageStyles from "./LandingPage.module.css";

const LandingPage = ({movies, genres}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Slideshow logic
  useEffect(() => {
    if (movies.length === 0) return;
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [movies]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className={LandingPageStyles.container}>
      {/* <Navbar setShowMenu={setMenuOpen} showMenu={menuOpen} /> */}
      <div className={LandingPageStyles.pageContent}>
          <>
            <FeaturedMovie movies={movies} currentImageIndex={currentImageIndex} />
            <MovieGrid movies={movies} handleMovieClick={handleMovieClick} />
          </>
      </div>
      {showModal && <MovieModal movie={selectedMovie} onClose={() => setShowModal(false)} />}
    </div>
  );
};

// Navbar component


// FeaturedMovie component
const FeaturedMovie = ({ movies, currentImageIndex }) => {
  const movie = movies[currentImageIndex];

  if (!movie) return null;

  return (
    <div className={FeaturedMovieStyles.container}>
      <img
        src={movie.slidingImage}
        alt={movie.title}
        className={FeaturedMovieStyles.image}
      />
      <div className={FeaturedMovieStyles.gradientOverlay}>
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
  );
};

// MovieGrid component
const MovieGrid = ({ movies, handleMovieClick }) => (
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
        <button className={LandingPageStyles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <h2 className={LandingPageStyles.modalTitle}>{movie.title}</h2>
        <img src={movie.image} alt={movie.title} className={LandingPageStyles.modalImage} />
        <p className={LandingPageStyles.modalSynopsis}>{movie.synopsis}</p>
      </div>
    </div>
  );
};

export default LandingPage;
