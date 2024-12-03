import React from "react";
import MovieGridStyles from "../Screen/LandingPage//MovieGrid.module.css";
import MovieDetails from "./MovieDetails.js";

const MovieGrid = ({ movies, handleMovieClick, selectedMovie, detailsRef }) => {
  const itemsPerRow = 4;

  // Dynamically insert movie details in the grid
  const renderMoviesWithDetails = () => {
    const elements = [];
    let currentRow = [];

    movies.forEach((movie, index) => {
      currentRow.push(
        <div
          key={movie.id}
          className={`${MovieGridStyles.card} ${
            selectedMovie && selectedMovie.id === movie.id
              ? MovieGridStyles.selected
              : ""
          }`}
          onClick={() => handleMovieClick(movie)}
        >
          <img
            src={movie.image}
            alt={movie.title}
            className={MovieGridStyles.cardImage}
          />
          <div className={MovieGridStyles.cardOverlay}>
            <div className={MovieGridStyles.cardTitle}>{movie.title}</div>
          </div>
        </div>
      );

      // Check if we are at the end of the row or the last movie
      const isRowEnd = (index + 1) % itemsPerRow === 0 || index === movies.length - 1;

      if (isRowEnd) {
        // Add the current row to the elements
        elements.push(
          <div key={`row-${Math.floor(index / itemsPerRow)}`} className={MovieGridStyles.gridRow}>
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
              className={MovieGridStyles.detailsContainer}
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

    return elements;
  };

  return (
    <div className={MovieGridStyles.container}>
      <h2 className={MovieGridStyles.title}>Trending Movies</h2>
      {renderMoviesWithDetails()}
    </div>
  );
};

export default MovieGrid;
