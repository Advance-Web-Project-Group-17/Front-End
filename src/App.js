import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from './Screen/LandingPage/LandingPage.jsx';
import LoginPage from "./Screen/LoginPage/LoginPage.jsx";
import RegisterPage from "./Screen/RegisterPage/RegisterPage.jsx";
import Navbar from "./Screen/NavBar/NavBar.jsx";
import MoviesPage from "./Screen/MoviesPage/MoviesPage.jsx";
import './App.css';
import HeroSection from "./Screen/HomePage/HomePage.jsx";
import TVShowGrid from "./Screen/TvshowPage/TVShowGrid.jsx";

function App() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [movies, SetMovies] = useState([]);
  const [trendingTVShows, setTrendingTVShows] = useState([]);
  const [tvShows, setTVShows] = useState([]);
  const [genres, setGenres] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("isLoggedIn") === "true");

  // Fetch movie data from TMDB API
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const apiKey = "01317230958149c57ec3ae676ea0850a";
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`
        );
        
        // Map genre IDs to genre names
        const moviesData = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          slidingImage: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
          rating: movie.vote_average.toFixed(1),
          genres: movie.genre_ids.map((id) => genres[id] || 'Unknown'), // Map genre IDs to genre names
          synopsis: movie.overview,
        }));
        setTrendingMovies(moviesData);
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    };

    fetchTrendingMovies();
  }, [genres]); // Depend on genres to ensure movies data updates once genres are loaded

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = "01317230958149c57ec3ae676ea0850a";
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`
        );
        
        // Map genre IDs to genre names
        const moviesData = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          rating: movie.vote_average.toFixed(1),
          genres: movie.genre_ids.map((id) => genres[id] || 'Unknown'), // Map genre IDs to genre names
          synopsis: movie.overview,
        }));
        SetMovies(moviesData);
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    };

    fetchMovies();
  }, [genres]);

// Fetch trending TV shows from TMDB API
useEffect(() => {
  const fetchTrendingTVShows = async () => {
    try {
      const apiKey = "01317230958149c57ec3ae676ea0850a";
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`
      );

      // Map genre IDs to genre names
      const tvShowsData = response.data.results.map((tvShow) => ({
        id: tvShow.id,
        title: tvShow.name, // Use 'name' for TV shows instead of 'title'
        image: `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`,
        slidingImage: `https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path}`,
        rating: tvShow.vote_average.toFixed(1),
        genres: tvShow.genre_ids.map((id) => genres[id] || 'Unknown'), // Map genre IDs to genre names
        synopsis: tvShow.overview,
      }));
      setTrendingTVShows(tvShowsData);
    } catch (e) {
      console.error("Error fetching TV shows:", e);
    }
  };

  fetchTrendingTVShows();
}, [genres]); // Depend on genres to ensure TV shows data updates once genres are loaded

useEffect(() => {
  const fetchTVShows = async () => {
    try {
      const apiKey = "01317230958149c57ec3ae676ea0850a";
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}`
      );

      // Map genre IDs to genre names
      const tvShowsData = response.data.results.map((tvShow) => ({
        id: tvShow.id,
        title: tvShow.name, // Use 'name' for TV shows instead of 'title'
        image: `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`,
        rating: tvShow.vote_average.toFixed(1),
        genres: tvShow.genre_ids.map((id) => genres[id] || 'Unknown'), // Map genre IDs to genre names
        synopsis: tvShow.overview,
      }));
      setTVShows(tvShowsData);
    } catch (e) {
      console.error("Error fetching TV shows:", e);
    }
  };

  fetchTVShows();
}, [genres]);


  // Fetch genre data from TMDB API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
        const response = await axios.get(url, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMTMxNzIzMDk1ODE0OWM1N2VjM2FlNjc2ZWEwODUwYSIsIm5iZiI6MTczMTY2OTcxMC45MTAzNzQyLCJzdWIiOiI2NzMzMjdhZjFkNzJlYjY1ZjQyZTY5ZmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.v7xAB7bBiSPC3axkDHPTrxRG9aDzg5E6b0oBfnG0TDs'
          }
        });
        
        // Create a mapping of genre ID to genre name
        const genreMap = response.data.genres.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});
        
        setGenres(genreMap);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<LandingPage movies={trendingMovies} />} />
          <Route path="/movies" element={<MoviesPage movies={movies} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HeroSection />} />
          <Route path="/tvshows" element={<TVShowGrid movies={tvShows} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
