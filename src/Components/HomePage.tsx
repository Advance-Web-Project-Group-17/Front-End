import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./HomePage.module.css";

function HomePage() {
  interface Movie {
    id: number;
    poster_path: string;
    original_title?: string;
    original_name?: string;
  }

  const [movieData, setMovieData] = useState<Movie[]>([]);

  useEffect(() => {
    getTrendingMovieData();
  }, []);

  async function getTrendingMovieData() {
    try {
      const apiKey = import.meta.env.VITE_API_KEY;
      let response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`
      );
      console.log(21, response.data.results);
      setMovieData(response.data.results);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <div className={styles.background_container}>
        <div className={styles.flex_container}>
          {movieData.map((item) => (
            <div className={styles.movie_item} key={item.id}>
              <img
                src={`https://image.tmdb.org/t/p/w300/${item.poster_path}`}
                alt={item.original_title || item.original_name}
              />
              <div className={styles.movie_name}>
                {item.original_title || item.original_name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage;
