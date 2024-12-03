import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ShowTimesPage.module.css'; // Import the CSS module

const ShowTimesPage = () => {
  const [schedule, setSchedule] = useState(null); // State to store show schedule
  const [error, setError] = useState(null); // State to handle errors
  const [theaters, setTheaters] = useState([]); // State to store theater list
  const [selectedTheater, setSelectedTheater] = useState("1018"); // Default theater ID

  // Fetch showtimes
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const date = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        const response = await axios.get(
          `https://www.finnkino.fi/xml/Schedule/?area=${selectedTheater}&dt=${date}`
        );
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        const shows = Array.from(xmlDoc.getElementsByTagName("Show")).map((show) => ({
          title: show.getElementsByTagName("Title")[0]?.textContent,
          startTime: show.getElementsByTagName("dttmShowStart")[0]?.textContent,
          theatre: show.getElementsByTagName("Theatre")[0]?.textContent,
          image: show.getElementsByTagName("EventLargeImagePortrait")[0]?.textContent, // Extract image URL
        }));

        setSchedule(shows);
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError("Failed to load showtimes.");
      }
    };

    fetchSchedule();
  }, [selectedTheater]); // Refetch showtimes whenever the selected theater changes

  // Fetch list of theaters
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await axios.get(`https://www.finnkino.fi/xml/TheatreAreas/`);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        const theaterList = Array.from(xmlDoc.getElementsByTagName("TheatreArea")).map((theater) => ({
          id: theater.getElementsByTagName("ID")[0]?.textContent,
          name: theater.getElementsByTagName("Name")[0]?.textContent,
        }));

        setTheaters(theaterList);
      } catch (err) {
        console.error("Error fetching theaters:", err);
        setError("Failed to load theaters.");
      }
    };

    fetchTheaters();
  }, []);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!schedule || !theaters.length) {
    return <div className={styles.loading}>Loading...</div>; // Display loading state
  }

  return (
    <div className={styles.showTimesContainer}>
      {/* Theater selection dropdown */}
      <div className={styles.theaterSelector}>
        <label htmlFor="theaterSelect">Select Theater:</label>
        <select
          id="theaterSelect"
          value={selectedTheater}
          onChange={(e) => setSelectedTheater(e.target.value)}
          className={styles.selectDropdown}
        >
          {theaters.map((theater) => (
            <option key={theater.id} value={theater.id} className={styles.selectOption}>
              {theater.name}
            </option>
          ))}
        </select>
      </div>

      {/* Page Title */}
      <h1 className={styles.pageTitle}>Showtimes</h1>

      {/* Showtimes List */}
      <ul className={styles.showList}>
        {schedule.map((show, index) => (
          <li key={index} className={styles.showCard}>
            {show.image && (
              <img src={show.image} alt={show.title} className={styles.showImage} />
            )}
            <div className={styles.showTitle}>{show.title}</div>
            <div className={styles.showDetails}>
              Start Time: {new Date(show.startTime).toLocaleString()} <br />
              Theatre: {show.theatre}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowTimesPage;
