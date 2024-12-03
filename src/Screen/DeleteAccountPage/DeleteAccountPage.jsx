import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./DeleteAccountPage.module.css";

const DeleteAccountPage = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [editData, setEditData] = useState({
    password: "",
  });
  const user_id = sessionStorage.getItem("id");
  const navigate = useNavigate();

  // Function to log out the user
  const onLogout = () => {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");
    navigate("/"); // Redirect to homepage or login page
  };

  // Handle account deletion
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    console.log(editData);  // Check if password is populated
    try {
      const response = await axios.post(`${baseUrl}/user/delete/${user_id}`, {
        password: editData.password,
      });
  
      if (response.status === 200) {
        alert("Delete account successfully")
        onLogout(); // Log out the user upon successful deletion
      }
      if (response.status === 400) {
        alert("You are an admin of some group. Please grant more admins.");
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Error deleting account.");
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Delete Account</h2>
        </div>
        <form className={styles.form} onSubmit={handleDeleteAccount}>
          <div className={styles.inputContainer}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="text" // Use "password" type for security
              required
              className={styles.inputField}
              placeholder="Enter password to delete account"
              value={editData.password}
              onChange={(e) =>
                setEditData({ ...editData, password: e.target.value })
              }
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
