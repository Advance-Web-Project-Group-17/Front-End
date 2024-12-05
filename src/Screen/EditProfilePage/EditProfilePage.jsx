import React, { useState } from "react";
import axios from "axios";
import styles from "./EditProfilePage.module.css";

const EditProfilePage = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [editData, setEditData] = useState({
    nick_name: "",
    location: "",
  });
  const isLoggedIn = sessionStorage.getItem("isLoggedIn")

  const handleEdit = async (e) => {
    e.preventDefault();
    console.log("Edit data:", editData);
    console.log(baseUrl);

    try {
        const user_id = sessionStorage.getItem("id")
      const response = await axios.put(`${baseUrl}/user/profile/edit/${user_id}`, {
        nick_name: editData.nick_name,
        location: editData.location,
      });

      console.log("Response:", response.data);
      if (response.status === 200) {
        if(isLoggedIn){
          alert("Update successful!")
        } else {
          alert("Update successful! Remember to verify your account via email before logging in")
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Edit your profile</h2>
        </div>
        <form className={styles.form} onSubmit={handleEdit}>
          <div className={styles.inputContainer}>
            <label htmlFor="nickname" className={styles.label}>
              Nickname
            </label>
            <input
              id="nickname"
              type="text"
              required
              className={styles.inputField}
              placeholder="Choose a nickname"
              value={editData.nick_name}
              onChange={(e) =>
                setEditData({ ...editData, nick_name: e.target.value })
              }
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="location" className={styles.label}>
              Location
            </label>
            <input
              id="location"
              type="text"
              required
              className={styles.inputField}
              placeholder="Enter your location"
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Edit profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
