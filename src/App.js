
import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Screen/LandingPage/LandingPage.jsx";
import LoginPage from "./Screen/LoginPage/LoginPage.jsx";
import RegisterPage from "./Screen/RegisterPage/RegisterPage.jsx";
import Navbar from "./Screen/NavBar/NavBar.jsx";
import MoviesPage from "./Screen/MoviesPage/MoviesPage.jsx";
import ShowTimesPage from "./Screen/ShowTimesPage/ShowTimesPage.jsx";
import ProfilePage from "./Screen/ProfilePage/ProfilePage.jsx";
import EditProfilePage from "./Screen/EditProfilePage/EditProfilePage.jsx";
import TVShowGrid from "./Screen/TvshowPage/TVShowGrid.jsx";
import GroupPage from "./Screen/GroupPage/GroupPage.jsx";
import GroupListPage from "./Screen/GroupListPage/GroupListPage.jsx";
import SharedProfilePage from "./Screen/SharedProfile/SharedProfile.jsx";
import Profilelist from "./Screen/ProfileList/Profilelist.jsx";
import DeleteAccountPage from "./Screen/DeleteAccountPage/DeleteAccountPage.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import "./App.css";

function App() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tvShows, setTVShows] = useState([]);
  const [genres, setGenres] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );

  const apiKey = process.env.REACT_APP_API_KEY;
  const tmdbHeaders = useMemo(
    () => ({
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMTMxNzIzMDk1ODE0OWM1N2VjM2FlNjc2ZWEwODUwYSIsIm5iZiI6MTczMTY2OTcxMC45MTAzNzQyLCJzdWIiOiI2NzMzMjdhZjFkNzJlYjY1ZjQyZTY5ZmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.v7xAB7bBiSPC3axkDHPTrxRG9aDzg5E6b0oBfnG0TDs",
      },
    }),
    []
  );
  

  // Fetch movie and TV genres and combine them
  useEffect(() => {
    const fetchCombinedGenres = async () => {
      try {
        const [movieGenresResponse, tvGenresResponse] = await Promise.all([
          axios.get(
            "https://api.themoviedb.org/3/genre/movie/list?language=en",
            tmdbHeaders
          ),
          axios.get(
            "https://api.themoviedb.org/3/genre/tv/list?language=en",
            tmdbHeaders
          ),
        ]);
  
        const combinedGenres = {
          ...movieGenresResponse.data.genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          }, {}),
          ...tvGenresResponse.data.genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          }, {}),
        };
  
        setGenres(combinedGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
  
    fetchCombinedGenres();
  }, [tmdbHeaders]); // Add tmdbHeaders to the dependency array
  

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
          rating: (movie.vote_average / 2).toFixed(1),
          genres: movie.genre_ids.map((id) => genres[id] || "Unknown"),
          synopsis: movie.overview,
          releaseYear: movie.release_date
            ? movie.release_date.split("-")[0]
            : "N/A",
        }));
  
        setTrendingMovies(moviesData);
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    };
  
    if (Object.keys(genres).length > 0) {
      fetchTrendingMovies();
    }
  }, [genres, apiKey]); // Add apiKey to the dependency array
  

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
          rating: (movie.vote_average / 2).toFixed(1),
          genres: movie.genre_ids.map((id) => genres[id] || "Unknown"),
          synopsis: movie.overview,
          releaseYear: movie.release_date
            ? movie.release_date.split("-")[0]
            : "N/A",
        }));
  
        setMovies(moviesData);
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    };
  
    if (Object.keys(genres).length > 0) {
      fetchMovies();
    }
  }, [genres, apiKey]); // Add apiKey to the dependency array
  

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/tv`,
          tmdbHeaders
        );
  
        const tvShowsData = response.data.results.map((tvShow) => ({
          id: tvShow.id,
          title: tvShow.name,
          image: `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`,
          rating: (tvShow.vote_average / 2).toFixed(1),
          genres: tvShow.genre_ids.map((id) => genres[id] || "Unknown"),
          synopsis: tvShow.overview,
          releaseYear: tvShow.release_date
            ? tvShow.release_date.split("-")[0]
            : "N/A",
        }));
  
        setTVShows(tvShowsData);
      } catch (e) {
        console.error("Error fetching TV shows:", e);
      }
    };
  
    fetchTVShows();
  }, [genres, tmdbHeaders]); // Add tmdbHeaders to the dependency array
  

  return (
    <div className="App">
      <Router>
        <Navbar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/tvshows" element={<TVShowGrid movies={tvShows} />} />
            <Route path="/group/:group_id" element={<GroupPage />} />
            <Route path="/group" element={<GroupListPage />} />
            <Route path="/movies" element={<MoviesPage movies={movies} />} />
            <Route path="/profilelist" element={<Profilelist />} />
            <Route
              path="/sharedprofile/:user_id"
              element={<SharedProfilePage />}
            />
            <Route path="/delete" element={<DeleteAccountPage />} />
            <Route
            path="/profile"
            element={<ProfilePage setIsLoggedIn={setIsLoggedIn} />}
          />
          </Route>
          <Route path="/" element={<LandingPage movies={trendingMovies} />} />

          <Route path="/show" element={<ShowTimesPage />} />
          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/edit" element={<EditProfilePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
