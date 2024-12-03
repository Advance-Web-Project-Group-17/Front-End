import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaStar, FaTimes } from "react-icons/fa";
import MovieGridStyles from "./MovieGrid.module.css";
import FeaturedMovieStyles from "./FeaturedMovie.module.css";
import LandingPageStyles from "./LandingPage.module.css";
import MovieCard from "../../components/MovieCard";
import MovieDetails from "../../components/MovieDetails";
import MovieGrid from "../../components/MovieGrid";

const LandingPage = ({ movies }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const detailsRef = useRef(null);

  // Slideshow logic
  useEffect(() => {
    if (movies.length === 0) return;
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [movies]);

  const handleMovieClick = (movie) => {
    //console.log("Movie clicked:", movie);
    if (selectedMovie && selectedMovie.id === movie.id) {
      setSelectedMovie(null); // Collapse the details if clicked again
    } else {
      setSelectedMovie(movie);
    }

    // Scroll to the MovieDetails section
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0); // Ensure the ref is available after rendering
  };

  return (
    <div className={LandingPageStyles.container}>
      <div className={LandingPageStyles.pageContent}>
        <FeaturedMovie movies={movies} currentImageIndex={currentImageIndex} />
        <MovieGrid
          movies={movies}
          selectedMovie={selectedMovie}
          handleMovieClick={handleMovieClick}
          detailsRef={detailsRef} // Pass the ref here
        />
      </div>
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

export default LandingPage;