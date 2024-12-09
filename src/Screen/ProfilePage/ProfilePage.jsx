import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProfilePage.module.css"; // Import the CSS module

const ProfilePage = ({ setIsLoggedIn }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [userGroup, setUserGroup] = useState([]);
  const [groupMovies, setGroupMovies] = useState([]);
  const [groupTvShows, setGroupTvShows] = useState([]);
  const user_id = sessionStorage.getItem("id");

  // Fetch user's data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      const user_id = sessionStorage.getItem("id");
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
  }, [baseUrl]);

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

  const handleDeleteAccount = async () => {
    navigate("/delete");
  };

  const handleGroupClick = (group_id) => {
    navigate(`/group/${group_id}`);
  };

  const onLogout = () => {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("is_admin")
    setIsLoggedIn(false);
    navigate("/");
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
  const shareProfile = async () => {
    const user_id = sessionStorage.getItem("id"); // Fetch from sessionStorage
    if (!user_id) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.put(`${baseUrl}/user/profile/share`, {
        user_id, // Send user_id from sessionStorage
        is_shared: "true",
      });

      if (response.status === 200) {
        alert("Profile shared successfully.");
      } else {
        alert("Failed to share profile. Please try again.");
      }
    } catch (error) {
      console.error("Error sharing profile:", error);
      alert("An error occurred while sharing the profile.");
    }
  };

  const unSharedProfile = async () => {
    const user_id = sessionStorage.getItem("id"); // Fetch from sessionStorage
    if (!user_id) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.put(`${baseUrl}/user/profile/share`, {
        user_id, // Send user_id from sessionStorage
        is_shared: "false",
      });

      if (response.status === 200) {
        alert("Profile unshared successfully.");
      } else {
        alert("Failed to unshare profile. Please try again.");
      }
    } catch (error) {
      console.error("Error unsharing profile:", error);
      alert("An error occurred while unsharing the profile.");
    }
  };

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
            <p>
              {userGroup.map((group) => (
                <div
                  className={styles.profileBioText}
                  onClick={() => {
                    handleGroupClick(group.group_id);
                  }}
                >
                  {group.group_name}
                </div>
              )) || "You are not in any group"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className={styles.profileActions}>
            <button
              className={styles.editProfileBtn}
              onClick={() => navigate("/edit")}
            >
              Edit Profile
            </button>
            <button
              className={styles.editProfileBtn}
              onClick={() => {
                shareProfile();
              }}
            >
              Share Profile
            </button>
            <button
              className={styles.deleteAccountBtn}
              onClick={() => {
                unSharedProfile();
              }}
            >
              Unshare Profile
            </button>
            <button
              className={styles.deleteAccountBtn}
              onClick={() => handleDeleteAccount()}
            >
              Delete Account
            </button>
          </div>

          {/* Logout Button */}
          <button onClick={onLogout} className={styles.logoutBtn}>
            Logout
          </button>
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

export default ProfilePage;
