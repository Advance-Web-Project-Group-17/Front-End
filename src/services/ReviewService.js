import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Replace with your backend URL

// Fetch reviews for a specific movie
export const getReviews = async (movieId) => {
  const response = await axios.get(`${API_BASE_URL}/movies/${movieId}/reviews`);
  return response.data.reviews;
};

// Post a new review
export const postReview = async (review) => {
  const response = await axios.post(`${API_BASE_URL}/reviews`, review, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};
