// HeroSection.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HomePage.module.css";

const HeroSection = () => {
  const [featuredShow, setFeaturedShow] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://api.themoviedb.org/3/trending/tv/day?api_key=YOUR_API_KEY"
      )
      .then((response) => {
        setFeaturedShow(response.data.results[0]);
      })
      .catch((error) => console.error("Error fetching featured show:", error));
  }, []);

  if (!featuredShow) return <div>Loading...</div>;

  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredShow.backdrop_path})`,
      }}
    >
      <div className="hero-overlay">
        <h1>{featuredShow.name}</h1>
        <p>{featuredShow.overview}</p>
        <button>Watch Now</button>
      </div>
    </div>
  );
};

export default HeroSection;
