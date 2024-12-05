import React, { useState, useRef } from "react";
import axios from "axios";
import { FaSearch, FaStar, FaHeart } from "react-icons/fa";
import styles from "./MoviesPage.module.css"; // Importing the CSS module
import MovieDetails from "../../components/MovieDetails";


const MoviesPage = ({ movies, handleMovieClick }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null); // Add state for the selected movie
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const user_id = sessionStorage.getItem("id");

  // Fetch user groups when the modal is opened
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
      const response = await axios.post(`${baseUrl}/group/addMovie`, {
        group_id: selectedGroupId,
        movie_id: selectedMovieId,
        user_id,
      });

      if (response.status === 200) {
        alert("Movie added to group successfully!");
        setIsModalOpen(false); // Close the modal after adding
        setSelectedGroupId(null); // Reset the selected group
        setSelectedMovieId(null); // Reset the selected movie
      }
    } catch (error) {
      console.error("Error adding movie to group:", error.message);
      alert("Failed to add movie to group.");
    }
  };

  const openModal = (movie_id) => {
    setIsModalOpen(true);
    setSelectedMovieId(movie_id); // Set the movie ID when modal is opened
    fetchUserGroups();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroupId(null); // Reset the selected group when closing
    setSelectedMovieId(null); // Reset the selected movie
  };

  const handleAddToFavorite = async (movie_id) => {
    if (!movie_id) {
      alert("Please select a movie.");
      return;
    }
  
    try {
      const response = await axios.post(`${baseUrl}/favorites/add`, {
        user_id,
        movie_id,
        type: "movie",
      });
  
      if (response.status === 201) {
        alert("Movie added to favorites successfully!");
      }
      if (response.status === 400) {
        alert("This TV show already in your favorite list")
      }
    } catch (error) {
      console.error("Error adding movie to favorites:", error.message);
      alert("Failed to add movie to favorites.");
    }
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
        handleAddToGroup={openModal}
        handleAddToFavorite={handleAddToFavorite} // Open modal when clicked
      />
    </div>
  );
};

// SearchBar Component
const SearchBar = ({ setSearchResults }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDisplayCategory, setSelectedDisplayCategory] = useState("Title");
  const [selectedCategory, setSelectedCategory] = useState("title");
  const [input, setInput] = useState("");

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const takeInput = (e) => {
    setInput(e.target.value);
  };

  const searchFilm = async () => {
    try {
      if (!input) {
        setSearchResults([]); // Clear search results if input is empty
        return;
      }

      const response = await axios.get(
        `${baseUrl}/search/movie?${selectedCategory}=${input}`
      );

      const moviesData = response.data.map((movie) => ({
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
      setSearchResults(moviesData); // Update state with mapped data
    } catch (error) {
      console.error("Error fetching movies:", error.message);
      setSearchResults([]); // Clear results on error
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
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
const MovieGrid = ({ movies, handleAddToGroup, handleAddToFavorite }) =>  {
  
  //console.log("Rendering MovieGrid with movies:", movies);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const detailsRef = useRef(null);

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

  const itemsPerRow = 4;

  // Dynamically insert movie details in the grid
  const renderMoviesWithDetails = () => {
    const elements = [];
    let currentRow = [];

    movies.forEach((movie, index) => {
      currentRow.push(
          <MovieCard
            key={movie.id}
            movie={movie}
            handleMovieClick={handleMovieClick}
            handleAddToGroup={() => handleAddToGroup(movie.id)}
            handleAddToFavorite={() => handleAddToFavorite(movie.id)} // Pass movie.id when clicked
          />
      );

      // Check if we are at the end of the row or the last movie
      const isRowEnd = (index + 1) % itemsPerRow === 0 || index === movies.length - 1;

      if (isRowEnd) {
        // Add the current row to the elements
        elements.push(
          <div key={`row-${Math.floor(index / itemsPerRow)}`} className={styles.gridRow}>
            {currentRow}
          </div>
        );

        // Insert movie details after this row if the selected movie is in this row
        if (
          selectedMovie &&
          Math.floor(index / itemsPerRow) ===
            Math.floor(movies.findIndex((m) => m.id === selectedMovie.id) / itemsPerRow)
        ) {
          elements.push(
            <div 
              key={`details-${selectedMovie.id}`}
              className={styles.detailsContainer}
              ref={detailsRef} // Attach the ref here for MovieDetails
            >
              <MovieDetails movie={selectedMovie} />
            </div>
          );
        }

        // Reset the current row
        currentRow = [];
      }
    });

    console.log(elements)

    return elements;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Movies</h2>
      <div className={styles.grid}>
        {renderMoviesWithDetails()}
      </div>
    </div>
  )

};

// MovieCard Component
const MovieCard = ({ movie, handleMovieClick, handleAddToGroup, handleAddToFavorite }) => {

  //console.log("Rendering MovieCard with movies:", movie)

  return(
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
          handleAddToFavorite(); // Open modal when clicked
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
)};

export default MoviesPage;
