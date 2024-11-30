import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaStar, FaHeart } from "react-icons/fa";
import styles from "./TVShowGrid.module.css"; // Importing the CSS module

const TVShowGrid = ({ movies, handleMovieClick }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null); // Add state for the selected movie
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const user_id = sessionStorage.getItem("id");

  const fetchUserGroups = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/group/getUserGroup/${user_id}`
      );
      setUserGroups(response.data);
    } catch (error) {
      console.error("Error fetching user groups:", error);
    }
  };

  // Handle adding movie to the selected group
  const handleAddToGroup = async () => {
    if (!selectedGroupId || !selectedMovieId) {
      alert("Please select a group and a movie.");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/group/addTvShow`, {
        group_id: selectedGroupId,
        tv_id: selectedMovieId,
        user_id,
      });

      if (response.status === 200) {
        alert("TV Show added to group successfully!");
        setIsModalOpen(false); // Close the modal after adding
        setSelectedGroupId(null); // Reset the selected group
        setSelectedMovieId(null); // Reset the selected movie
      }
    } catch (error) {
      console.error("Error adding movie to group:", error.message);
      alert("Failed to add movie to group.");
    }
  };

  const openModal = (tv_id) => {
    setIsModalOpen(true);
    setSelectedMovieId(tv_id); // Set the movie ID when modal is opened
    fetchUserGroups();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroupId(null); // Reset the selected group when closing
    setSelectedMovieId(null); // Reset the selected movie
  };

  return (
    <div className={styles.pageContainer}>
      <SearchBar setSearchResults={setSearchResults} />
      
      {/* Modal for Group Selection */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Select a Group</h3>
            <table className={styles.groupTable}>
              <thead>
                <tr>
                  <th>Group Name</th>
                </tr>
              </thead>
              <tbody>
                {userGroups.length > 0 ? (
                  userGroups.map((group) => (
                    <tr key={group.group_id}>
                      <td onClick={() => setSelectedGroupId(group.group_id)}>
                        {group.group_name}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No groups found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={styles.modalButtons}>
              <button onClick={closeModal}>Close</button>
              <button onClick={handleAddToGroup}>Add to Group</button>
            </div>
          </div>
        </div>
      )}

      <MovieGrid
        movies={searchResults.length > 0 ? searchResults : movies}
        handleMovieClick={handleMovieClick}
        handleAddToGroup={openModal} // Open modal when clicked
      />
    </div>
  );
};

// SearchBar Component
const SearchBar = ({ setSearchResults }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDisplayCategory, setSelectedDisplayCategory] =
    useState("Title");
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
        `${baseUrl}/search/tv?${selectedCategory}=${input}`
      );
      const moviesData = response.data.map((movie) => ({
        id: movie.id,
        title: movie.name,
        image: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/placeholder.jpg", // Fallback for missing poster
        rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
        genres: movie.genres || ["Unknown"], // Handle missing genres
        synopsis: movie.overview || "No synopsis available",
        releaseDate: movie.release_date || "Unknown release date",
      }));
      console.log("worked");
      setSearchResults(moviesData); // Update state with mapped data

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
            <li onClick={() => handleCategorySelect("release_year")}>
              Release Year
            </li>
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
      <i
        className={styles.searchButton}
        onClick={() => {
          searchFilm();
        }}
      >
        <FaSearch />
      </i>
    </div>
  );
};

// MovieGrid Component
const MovieGrid = ({ movies, handleMovieClick, handleAddToGroup }) => (
  <div className={styles.container}>
    <h2 className={styles.title}>Movies</h2>
    <div className={styles.grid}>
      {movies.length > 0 ? (
        movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            handleMovieClick={handleMovieClick}
            handleAddToGroup={() => handleAddToGroup(movie.id)} // Pass movie.id when clicked
          />
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  </div>
);

// MovieCard Component
const MovieCard = ({ movie, handleMovieClick, handleAddToGroup }) => (
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
      <button
        className={styles.heartButton}
        onClick={(e) => {
          e.stopPropagation();
          handleAddToGroup(movie.id); // Open modal when clicked
        }}
      >
        <FaHeart className={styles.heartIcon} />
      </button>
      <button
        className={styles.addToGroupButton}
        onClick={(e) => {
          e.stopPropagation();
          handleAddToGroup(movie.id); // Open modal when clicked
        }}
      >
        Add to Group
      </button>
    </div>
  </div>
);

export default TVShowGrid;
