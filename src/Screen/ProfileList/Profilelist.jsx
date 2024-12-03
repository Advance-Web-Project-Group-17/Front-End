import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProfileList.module.css"; // Import CSS module

export default function ProfileList() {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/shared`);
        console.log(response.data);
        if (response.status === 200) {
          setUserData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData(); // Call the async function
  }, []); // Empty dependency array ensures this runs only once

  const handleProfileClick = (user_id) => {
    navigate(`/sharedprofile/${user_id}`);
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile List</h1>
      <div className={styles.profileGrid}>
        {userData.map((user) => (
          <div
            key={user.id}
            className={styles.profileCard}
            onClick={() => {
              handleProfileClick(user.user_id);
            }}
          >
            {user.nick_name}
          </div>
        ))}
      </div>
    </div>
  );
}
