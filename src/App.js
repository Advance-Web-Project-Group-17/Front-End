import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from './Screen/LandingPage/LandingPage.jsx';
import LoginPage from "./Screen/LoginPage/LoginPage.jsx";
import RegisterPage from "./Screen/RegisterPage/RegisterPage.jsx";
import Navbar from "./Screen/NavBar/NavBar.jsx";
import MoviesPage from "./Screen/MoviesPage/MoviesPage.jsx";
import ShowTimesPage from "./Screen/ShowTimesPage/ShowTimesPage.jsx";
import ProfilePage from "./Screen/ProfilePage/ProfilePage.jsx";
import EditProfilePage from "./Screen/EditProfilePage/EditProfilePage.jsx";
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

  const apiKey = process.env.REACT_APP_API_KEY;
  const tmdbHeaders = {
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMTMxNzIzMDk1ODE0OWM1N2VjM2FlNjc2ZWEwODUwYSIsIm5iZiI6MTczMTY2OTcxMC45MTAzNzQyLCJzdWIiOiI2NzMzMjdhZjFkNzJlYjY1ZjQyZTY5ZmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.v7xAB7bBiSPC3axkDHPTrxRG9aDzg5E6b0oBfnG0TDs'
    }
  };

  // Fetch movie and TV genres and combine them
  useEffect(() => {
    const fetchCombinedGenres = async () => {
      try {
        const [movieGenresResponse, tvGenresResponse] = await Promise.all([
          axios.get('https://api.themoviedb.org/3/genre/movie/list?language=en', tmdbHeaders),
          axios.get('https://api.themoviedb.org/3/genre/tv/list?language=en', tmdbHeaders)
        ]);

        // Combine movie and TV genres into one object
        const combinedGenres = {
          ...movieGenresResponse.data.genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          }, {}),
          ...tvGenresResponse.data.genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          }, {})
        };

        setGenres(combinedGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchCombinedGenres();
  }, []);

  // Fetch trending movies
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`
        );

        const moviesData = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title || movie.name,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          slidingImage: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
          rating: movie.vote_average.toFixed(1),
          genres: movie.genre_ids.map((id) => genres[id] || 'Unknown'),
          synopsis: movie.overview,
        }));
        setTrendingMovies(moviesData);
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    };

    if (Object.keys(genres).length > 0) {
      fetchTrendingMovies();
    }
  }, [genres]);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`
        );

        const moviesData = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          rating: movie.vote_average.toFixed(1),
          genres: movie.genre_ids.map((id) => genres[id] || 'Unknown'),
          synopsis: movie.overview,
        }));
        setMovies(moviesData);
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    };

    if (Object.keys(genres).length > 0) {
      fetchMovies();
    }
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

  return (
    <div className="App">
      <Router>
        <Navbar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<LandingPage movies={trendingMovies} />} />
          <Route path="/movies" element={<MoviesPage movies={movies} />} />
          <Route path="/show" element={<ShowTimesPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/edit" element={<EditProfilePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
