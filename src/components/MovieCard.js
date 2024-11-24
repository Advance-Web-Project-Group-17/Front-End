import React from "react";
import MovieGridStyles from "../Screen/LandingPage/MovieGrid.module.css";

const MovieCard = ({ movie, onClick }) => (
  <div className={MovieGridStyles.card} onClick={onClick}>
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

export default MovieCard;
