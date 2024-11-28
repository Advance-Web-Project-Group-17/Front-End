import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ProfilePage.module.css'; // Import the CSS module

const ProfilePage = ({ setIsLoggedIn }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [userData, setUserData] = useState();

  // Fetch user's data from backend
  const fetchUserData = async () => {
    const user_id = sessionStorage.getItem('id');
    if (user_id) {
      try {
        const response = await axios.get(`${baseUrl}/user/profile/${user_id}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleDeleteAccount = async () => {
    const user_id = sessionStorage.getItem('id');
    try {
      const response = await axios.delete(`${baseUrl}/user/delete/${user_id}`);
      if(response.status === 200){
        onLogout();
      } else if(response.status === 400){
        alert("You are an admin of some group please grant more admin")
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  }

  const onLogout = () => {
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <img
              src={userData?.profile_image || 'https://robohash.org/example'}
              alt="Profile"
              className={styles.profileAvatar}
            />
            <div>
              <h2 className={styles.profileUsername}>
                {userData?.nick_name || 'User'}
              </h2>
              <p className={styles.profileLocation}>
                {userData?.location || 'Location not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className={styles.profileBioSection}>
          <h3 className={styles.profileBioTitle}>Groups</h3>
          <p className={styles.profileBioText}>
            {userData?.group_name || 'You are not in any group!'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className={styles.profileActions}>
          <button
            className={styles.editProfileBtn}
            onClick={() => navigate('/edit')}
          >
            Edit Profile
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
  );
};

export default ProfilePage;
