import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ShowTimesPage.module.css'; // Import the CSS module

const ShowTimesPage = () => {
  const [schedule, setSchedule] = useState(null); // State to store the parsed data
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get("https://www.finnkino.fi/xml/Schedule/?area=1018&dt=25.11.2024");
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        // Parse the XML data to extract necessary information
        const shows = Array.from(xmlDoc.getElementsByTagName("Show")).map(show => ({
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
  }, []);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!schedule) {
    return <div className={styles.loading}>Loading...</div>; // Display loading state
  }

  return (
    <div className={styles.showTimesContainer}>
      <h1 className={styles.pageTitle}>Showtimes</h1>
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
