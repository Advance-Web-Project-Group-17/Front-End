import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaStar } from "react-icons/fa";
import styles from "./TVShowGrid.module.css"; // Importing the CSS module

const TVShowGrid = ({ movies, handleMovieClick }) => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className={styles.pageContainer}>
      <SearchBar setSearchResults={setSearchResults} />
      <MovieGrid movies={searchResults.length > 0 ? searchResults : movies} handleMovieClick={handleMovieClick} />
    </div>
  );
};

// SearchBar Component
const SearchBar = ({ setSearchResults }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDisplayCategory, setSelectedDisplayCategory] = useState("Title");
  const [selectedCategory, setSelectedCategory] = useState("title");
  const [input, setInput] = useState(""); // Corrected state setter function name

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const takeInput = (e) => {
    setInput(e.target.value);
    console.log(e.target.value); // Log the value directly from the event
  };

  // Function to search for films based on input and selected category
  // Function to search for films based on input and selected category
  const searchFilm = async () => {
    try {
      if (!input) {
        setSearchResults([]); // Clear search results if input is empty
        return;
      }
  
      const response = await axios.get(
        `${baseUrl}/movie/search/?${selectedCategory}=${input}`
      );
  
      // Accessing the 'results' key which contains the array of movies
      if (response.data.results && response.data.results.length > 0) {
        const moviesData = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/placeholder.jpg", // Fallback for missing poster
          rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
          genres: movie.genres || ["Unknown"], // Handle missing genres
          synopsis: movie.overview || "No synopsis available",
          releaseDate: movie.release_date || "Unknown release date",
        }));
        console.log("worked")
        setSearchResults(moviesData); // Update state with mapped data
      } else {
        console.log("fail")
        setSearchResults([]); // Clear results if no valid response
      }
  
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error fetching movies:", error.message);
      setSearchResults([]); // Clear results on error
    }
  };
  
  // Trigger searchFilm whenever the input or selectedCategory changes

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // Set the selected category
    switch (category) {
      case "title":
        setSelectedDisplayCategory("Title");
        break;
      case "genre":
        setSelectedDisplayCategory("Genre");
        break;
      case "release_year":
        setSelectedDisplayCategory("Release Year");
        break;
      case "rating":
        setSelectedDisplayCategory("Rating");
        break;
      default:
        break;
    }
    setDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className={styles.searchBar}>
      {/* Dropdown */}
      <div className={styles.dropdown} onClick={toggleDropdown}>
        <div className={styles.dropdownText}>
          <span>{selectedDisplayCategory}</span>
        </div>
        {dropdownOpen && (
          <ul className={styles.dropdownList}>
            <li onClick={() => handleCategorySelect("title")}>Title</li>
            <li onClick={() => handleCategorySelect("genre")}>Genre</li>
            <li onClick={() => handleCategorySelect("release_year")}>Release Year</li>
            <li onClick={() => handleCategorySelect("rating")}>Rating</li>
          </ul>
        )}
      </div>

      {/* Search Box */}
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Enter your film's criteria you want to search here"
          onChange={takeInput}
        />
      </div>
      <i className={styles.searchButton} onClick={() => {searchFilm()}}><FaSearch /></i>
    </div>
  );
};

// MovieGrid Component
const MovieGrid = ({ movies, handleMovieClick }) => (
  <div className={styles.container}>
    <h2 className={styles.title}>TVshows</h2>
    <div className={styles.grid}>
      {movies.length > 0 ? (
        movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} handleMovieClick={handleMovieClick} />
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  </div>
);

// MovieCard Component
const MovieCard = ({ movie, handleMovieClick }) => (
  <div className={styles.card} onClick={() => handleMovieClick(movie)}>
    <img src={movie.image} alt={movie.title} className={styles.cardImage} />
    <div className={styles.cardOverlay}>
      <div className={styles.cardTitle}>{movie.title}</div>
      <div className={styles.cardDetails}>
        <div className={styles.rating}>
          <FaStar /> {movie.rating}
        </div>
        <div className={styles.genre}>{movie.genres.join(", ")}</div>
      </div>
    </div>
  </div>
);

export default TVShowGrid;
