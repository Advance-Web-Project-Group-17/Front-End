import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./RegisterPage.module.css";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const RegisterPage = () => {
  const baseUrl = "http://localhost:3001";
  const [signupData, setSignupData] = useState({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [LoggedIn, setLoggedIn] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    if (LoggedIn) {
      navigate("/edit");
    }
  }, [LoggedIn, navigate]);
  

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Signup data:", signupData);
    console.log(baseUrl);

    try {
      const response = await axios.post(`${baseUrl}/user/register`, {
        user_name: signupData.user_name,
        email: signupData.email,
        password: signupData.password,
      });

      console.log("Response:", response.data);
      if (response.status === 201) {
        sessionStorage.setItem("id", response.data.user_id);
        setLoggedIn(true);
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
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Join our community today</p>
        </div>
        <form className={styles.form} onSubmit={handleSignup}>
          <div className={styles.inputContainer}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              className={styles.inputField}
              placeholder="Choose a username"
              value={signupData.username}
              onChange={(e) =>
                setSignupData({ ...signupData, user_name: e.target.value })
              }
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="signup-email" className={styles.label}>
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              required
              className={styles.inputField}
              placeholder="Enter your email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="signup-password" className={styles.label}>
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              required
              className={styles.inputField}
              placeholder="Create a password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="confirm-password" className={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              className={styles.inputField}
              placeholder="Confirm your password"
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Create Account
          </button>

          <div className={styles.dividerContainer}>
            <div className={styles.dividerLine}></div>
            <div className={styles.dividerText}>Or sign up with</div>
          </div>

          <div className={styles.socialButtons}>
            <button type="button" className={styles.socialButton}>
              <FaGoogle className="mr-2" /> Google
            </button>
            <button type="button" className={styles.socialButton}>
              <FaFacebook className="mr-2" /> Facebook
            </button>
          </div>
        </form>
        <p className={styles.signInText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.signInLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
