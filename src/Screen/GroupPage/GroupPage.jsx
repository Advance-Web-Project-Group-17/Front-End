import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./GroupPage.module.css";

const GroupPage = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { group_id } = useParams();
  const [groupMovies, setGroupMovies] = useState([]);
  const [groupTvShows, setGroupTvShows] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isInGroup, setIsInGroup] = useState(false)
  const [is_admin, setIs_admin] = useState(false)
  const user_id = sessionStorage.getItem("id");
  const nav = useNavigate();

  useEffect(() => {
    const FetchGroupFilm = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/group/getMovie/${group_id}`
        );
        const moviesData = response.data.movies.map((movie) => ({
          id: movie.id,
          title: movie.title || movie.name,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          rating: movie.vote_average.toFixed(1),
          synopsis: movie.overview,
        }));
        setGroupMovies(moviesData);
      } catch (error) {
        console.error(error);
      }
    };
    FetchGroupFilm();
  }, []);

  useEffect(() => {
    const FetchGroupTvShow = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/group/getTvShow/${group_id}`
        );
        const moviesData = response.data.tvShows.map((movie) => ({
          id: movie.id,
          title: movie.title || movie.name,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          rating: movie.vote_average.toFixed(1),
          synopsis: movie.overview,
        }));
        setGroupTvShows(moviesData);
      } catch (error) {
        console.error(error);
      }
    };
    FetchGroupTvShow();
  }, []);

  useEffect(() => {
    const FetchGroupMembers = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/group/getMember/${group_id}`
        );
        setGroupMembers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    FetchGroupMembers();
  }, []);

  const handleDeleteMovie = async (movie_id) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/group/deleteMovie/${group_id}`,
        {
          data: { movie_id }, // Pass movie_id in the data object
        }
      );

      if (response.status === 200) {
        setGroupMovies((prevMovies) =>
          prevMovies.filter((movie) => movie.id !== movie_id)
        );
        console.log("Movie deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleRemoveUser = async (removed_id) => {
    console.log("Removing user with ID:", removed_id, "from group:", group_id, "by user:", user_id);
  
    try {
      const response = await axios.delete(`${baseUrl}/group/removeMember`, {
        data: { removed_id, group_id, user_id }, // Correctly pass required fields
      });
  
      if (response.status === 200) {
        setGroupMembers((prevMembers) =>
          prevMembers.filter((member) => member.user_id !== removed_id) // Filter out removed member
        );
        console.log("User removed successfully");
      } else{
        alert("You can not remove yourself")
      }
    } catch (error) {
      console.error("Error removing user:", error.response ? error.response.data : error);
      // Log the error response from backend for further analysis
    }
  };

  const handleGrantAdmin = async (grantedMemberId) => {
    try {
      // Ensure to await the response here
      const response = await axios.put(`${baseUrl}/group/grantAdmin/${group_id}`, {
        user_id,         // Current user trying to grant admin rights
        grantedMemberId, // Member to be granted admin rights
      });
  
      // Check if the response was successful
      if (response.status === 200) {
        console.log("Admin granted successfully");
        alert("Admin granted successfully"); // Optional: Provide user feedback
      }
    } catch (error) {
      console.error("Error granting admin:", error.response ? error.response.data : error);
      alert(error.response?.data?.message || "Error granting admin");
    }
  };
  
  const handleJoinGroup = async () => {
    try {
      const response = await axios.post(`${baseUrl}/group/addMember`, {
        user_id,
        group_id,
      });
      if (response.status === 200) {
        alert("Joined group successfully");
  
        // Update the `isInGroup` state to hide the "Join Group" button
        setIsInGroup(true);
  
        // Optionally add the new user to the `groupMembers` list
        setGroupMembers((prevMembers) => [
          ...prevMembers,
          {
            user_id: user_id,
            nick_name: response.data.nick_name,
          },
        ]);
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };
  
  
  const handleDeleteGroup = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/group/removeGroup/${group_id}`, {
        data: { user_id }, // Send user_id in the data field
      });
  
      if (response.status === 200) {
        alert("Group deleted successfully");
        nav("/")
      } else {
        alert("Failed to delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error.response ? error.response.data : error.message);
      alert("An error occurred while trying to delete the group.");
    }
  };

  useEffect(() => {
    const checkUserInGroup = async() => {
      try{
        const response = await axios.post(`${baseUrl}/group/checkMember/${group_id}`,{
          user_id
        })
        console.log(response.data)
        if(response.status === 200) {
          setIsInGroup(true)
        }
      }catch (error) {
        console.error("Error checking user in group:", error);
      }
    }
    checkUserInGroup()
  },[user_id, group_id])

  const handleOutGroup = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/group/outGroup/${group_id}`, {
        data: { removed_id: user_id }, // Use the "data" field to send the request body
      });
  
      if (response.status === 200) {
        alert("You have left the group successfully");
        setIsInGroup(false);
        nav("/"); // Redirect user to the home page
      } else {
        alert("You are the only admin please grant someone admin to leave group");
      }
    } catch (error) {
      console.error("Error leaving group:", error.response?.data || error.message);
      alert(error.response?.data?.message || "An error occurred while leaving the group");
    }
  };

  useEffect(() => {
    const checkUserAdmin = async () => {
      try {
        const response = await axios.post(`${baseUrl}/group/checkAdmin`, {
          user_id,
          group_id
        });
  
        if (response.status === 200) {
          console.log("is_admin" +is_admin)
          setIs_admin(true); // Set as boolean
        } else {
          setIs_admin(false); // Set as boolean if not admin
        }
      } catch (error) {
        console.error("Error checking if user is admin:", error);
        setIs_admin(false); // Set as false if there's an error
      }
    };
  
    if (user_id && group_id) {
      checkUserAdmin();
    }
  }, [user_id, group_id]); // This will only run when `user_id` or `group_id` changes
  
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        {is_admin === true && (
          <>
            <button className={styles.deleteGroupButton} onClick={() => {handleDeleteGroup()}}>Delete group</button>
          </>
        )}
        {isInGroup == false && (
          <button className={styles.newGroupButton} onClick={() => {handleJoinGroup()}}>Join group</button>
        )}
        <button className={styles.deleteGroupButton} onClick={() => {handleOutGroup()}}>Out group</button>
      </header>

      {/* Showtimes Section */}
      <div className={styles.showTimesContainer}>
        <h1 className={styles.pageTitle}>Group's Film</h1>
        <h1 className={styles.filmType}>Movies</h1>
        <ul className={styles.showList}>
          {groupMovies.map((movie) => (
            <li key={movie.id} className={styles.showCard}>
              <img
                src={movie.image}
                alt={movie.title}
                className={styles.showImage}
              />
              <div className={styles.showTitle}>{movie.title}</div>
              <div className={styles.showDetails}>
                <span>
                  <strong>Rating:</strong> {movie.rating}
                  <button
                    className={styles.deleteMovieButton}
                    onClick={() => handleDeleteMovie(movie.id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
        <h1 className={styles.filmType}>TV Shows</h1>
        <ul className={styles.showList}>
          {groupTvShows.map((movie) => (
            <li key={movie.id} className={styles.showCard}>
              <img
                src={movie.image}
                alt={movie.title}
                className={styles.showImage}
              />
              <div className={styles.showTitle}>{movie.title}</div>
              <div className={styles.showDetails}>
                <span>
                  <strong>Rating:</strong> {movie.rating}
                  <button
                    className={styles.deleteMovieButton}
                    onClick={() => handleDeleteMovie(movie.id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Members Section */}
      <h1>Members</h1>
      <div className={styles.userList}>
        {groupMembers.map((member) => (
          <div key={member.user_id} className={styles.userItem}>
            <span className={styles.userName}>
              {member.nick_name || "Unknown"}
            </span>
            {is_admin === "true" && (
              <div>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveUser(member.user_id)} // Correctly pass member.id to remove the user
                >
                  Remove
                </button>
                {user_id != member.user_id && (
                    <button className={styles.grantAdminButton} onClick={() => {handleGrantAdmin(member.user_id)}}>Grant admin</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupPage;
