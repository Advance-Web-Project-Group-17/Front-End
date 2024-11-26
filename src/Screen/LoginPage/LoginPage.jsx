import React, { useEffect, useState } from "react";
import styles from "./LoginPage.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const LoginPage = ({setIsLoggedIn}) => {
  const [loginData, setLoginData] = useState({ user_name: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login data:", loginData);

    try {
      const response = await axios.post("http://localhost:3001/user/login", {
        user_name: loginData.user_name,
        password: loginData.password,
      });

      // Save token to localStorage or context if login is successful
      if (response.status === 200) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("id", response.data.id)
        sessionStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true)
        setMessage("Login successful!");
        navigate("/")
        // setLoggedIn(true);
        //Redirect to homepage
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Please sign in to your account</p>
        </div>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              className={styles.input}
              placeholder="Enter your Username"
              value={loginData.user_name}
              onChange={(e) =>
                setLoginData({ ...loginData, user_name: e.target.value })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className={styles.input}
              placeholder="Enter your password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
          </div>

          <div className={styles.options}>
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className={styles.checkbox}
              />
              <label htmlFor="remember-me" className={styles.checkboxLabel}>
                Remember me
              </label>
            </div>

            <div className={styles.link}>
              <a href="#" className={styles.link}>
                Forgot password?
              </a>
            </div>
          </div>

          <button type="submit" className={styles.button}>
            Sign in
          </button>

          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <div className={styles.dividerText}>Or continue with</div>
            <div className={styles.dividerLine}></div>
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
        {message && <p className={styles.message}>{message}</p>}
        <p className={styles.signUpPrompt}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
