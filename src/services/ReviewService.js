import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_URL; // Replace with your backend URL
const apiKey = process.env.REACT_APP_API_KEY;

// Fetch reviews for a specific movie
/*export const getReviews = async (movieId) => {
  const response = await axios.get(`${API_BASE_URL}/movies/${movieId}/reviews`);
  return response.data.reviews;
};*/

export const getReviews = async (movieId) => {
  try {
    // Fetch reviews from the local database
    const localResponse = await axios.get(`${API_BASE_URL}/movies/${movieId}/reviews`);
    const localReviews = localResponse.data.reviews.map((review) => ({
      review_id: review.review_id,
      source: "Local",
      user_name: review.user_name,
      review_text: review.review_text,
      rating: review.rating,
      created_at: new Date(review.created_at).toLocaleDateString(),
    }));

    // Fetch reviews from TMDB
    const tmdbResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${apiKey}`
    );
    console.log(tmdbResponse)
    const tmdbReviews = tmdbResponse.data.results.map((review) => ({
      review_id: review.id,
      source: "TMDB",
      user_name: review.author,
      review_text: review.content,
      rating: review.author_details.rating / 2 || "No rating",
      created_at: new Date(review.created_at).toLocaleDateString(),
    }));

    // Combine local and TMDB reviews
    const combinedReviews = [...localReviews, ...tmdbReviews];

    // Return the combined reviews
    return combinedReviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return []; // Return an empty array in case of an error
  }
};

// Post a new review
/*export const postReview = async (review) => {
  const response = await axios.post(`${API_BASE_URL}/reviews`, review, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};*/

// Post a new review
export const postReview = async (review) => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in localStorage.");
    }

    console.log("Token being sent:", token);

    const response = await axios.post(`${API_BASE_URL}/reviews`, review, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error in postReview:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};

