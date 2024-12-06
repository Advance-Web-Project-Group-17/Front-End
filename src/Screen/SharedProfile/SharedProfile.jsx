import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./SharedProfile.module.css"; // Import the CSS module

const SharedProfilePage = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [userGroup, setUserGroup] = useState([]);
  const [groupMovies, setGroupMovies] = useState([]);
  const [groupTvShows, setGroupTvShows] = useState([]);
  const user_id = useParams().user_id;

  // Fetch user's data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (user_id) {
        try {
          const response = await axios.get(
            `${baseUrl}/user/profile/${user_id}`
          );
          setUserData(response.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [baseUrl, user_id]);

  useEffect(() => {
    const fetchUserGroup = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/group/getUserGroup/${user_id}`
        );
        setUserGroup(response.data);
      } catch (error) {
        console.error("Error fetching user groups:", error);
      }
    };
    fetchUserGroup();
  }, [baseUrl, user_id]);

  const handleGroupClick = (group_id) => {
    navigate(`/group/${group_id}`);
  };

  useEffect(() => {
    const fetchUserFavorite = async () => {
      try {
        const response = await axios.get(`${baseUrl}/favorites/${user_id}`);
        if (response.data.movies) {
          try {
            const moviesData = response.data.movies.map((movie) => ({
              id: movie.id,
              title: movie.title || movie.name,
              image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              rating: movie.vote_average.toFixed(1),
              synopsis: movie.overview,
            }));
            setGroupMovies(moviesData);
          } catch (error) {
            console.log(error);
          }
        }
        if (response.data.tvShows) {
          try {
            const moviesData = response.data.tvShows.map((movie) => ({
              id: movie.id,
              title: movie.title || movie.name,
              image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              rating: movie.vote_average.toFixed(1),
              synopsis: movie.overview,
            }));
            setGroupTvShows(moviesData);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserFavorite();
  }, [baseUrl, user_id]);

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <img
                src={userData?.profile_image || "https://robohash.org/example"}
                alt="Profile"
                className={styles.profileAvatar}
              />
              <div>
                <h2 className={styles.profileUsername}>
                  {userData?.nick_name || "User"}
                </h2>
                <p className={styles.profileLocation}>
                  {userData?.location || "Location not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className={styles.profileBioSection}>
            <h3 className={styles.profileBioTitle}>Groups</h3>
            {userGroup.length > 0 ? (
              userGroup.map((group) => (
                <div
                  key={group.group_id}
                  className={styles.profileBioText}
                  onClick={() => handleGroupClick(group.group_id)}
                >
                  {group.group_name}
                </div>
              ))
            ) : (
              <p>This user is not in any group!</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.showTimesContainer}>
        <h1 className={styles.filmType}>Favorite List</h1>
        <h2 className={styles.filmType}>Movies</h2>
        {groupMovies.length > 0 ? (
          <ul className={styles.showList}>
            {groupMovies.map((movie) => (
              <li key={movie.id} className={styles.showCard}>
                <img
                  src={movie.image}
                  alt={movie.title}
                  className={styles.showImage}
                />
                <div className={styles.showContent}>
                  <div className={styles.showTitle}>{movie.title}</div>
                  <div className={styles.showDetails}>
                    <strong>Rating:</strong> {movie.rating}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite movies found.</p>
        )}
        <h2 className={styles.filmType}>TV Shows</h2>
        {groupTvShows.length > 0 ? (
          <ul className={styles.showList}>
            {groupTvShows.map((show) => (
              <li key={show.id} className={styles.showCard}>
                <img
                  src={show.image}
                  alt={show.title}
                  className={styles.showImage}
                />
                <div className={styles.showContent}>
                  <div className={styles.showTitle}>{show.title}</div>
                  <div className={styles.showDetails}>
                    <strong>Rating:</strong> {show.rating}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite TV shows found.</p>
        )}
      </div>
    </div>
  );
};

export default SharedProfilePage;
