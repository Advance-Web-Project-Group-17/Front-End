import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ProfilePage.module.css'; // Import the CSS module


const ProfilePage = ({setIsLoggedIn}) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
//   const navigate = useNavigate();
  const [userData, setUserData] = useState();

  const Navigate = useNavigate();

  // Fetch user's data from backend
  const fetchUserData = async () => {
    const user_id = sessionStorage.getItem("id");
    if (user_id) {
      try {
        const response = await axios.get(`${baseUrl}/user/profile/${user_id}`);
        console.log(response.data)
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onLogout = () => {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    Navigate('/');
  };


  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <img
              src={"https://robohash.org/example"} // Placeholder avatar if no profile picture
              alt="Profile"
              className={styles.profileAvatar}
            />
            <div>
              <h2 className={styles.profileUsername}>
                Welcome, {userData?.nick_name || "User"}!
              </h2>
              <p className={styles.profileLocation}>{userData?.location || "Unknown Location"}</p>
            </div>
          </div>
          {/* Edit Profile Button */}
          <button className={styles.editProfileBtn} onClick={() => {Navigate("/edit")}}>
            Edit Profile
          </button>
        </div>
        {/* Bio Section */}
        {/* <div className={styles.profileBioSection}>
          <h3 className={styles.profileBioTitle}>Bio</h3>
          <p className={styles.profileBioText}>
            {userData?.bio || ""}
          </p>
        </div> */}
        {/* Statistics */}
        {/* <div className={styles.profileStats}>
          <div className={styles.profileStatCard}>
            <h4 className={styles.profileStatTitle}>Spots Uploaded</h4>
            <p className={styles.profileStatNumber}>{userData?.post_count}</p> 
          </div>
        </div> */}
        {/* Logout Button */}
        <button onClick={onLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
