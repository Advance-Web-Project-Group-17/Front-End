import React, { useEffect, useState } from "react";
import { getReviews, postReview } from "../services/ReviewService.js";
import MovieDetailsStyles from "../Screen/LandingPage/MovieDetails.module.css";

const MovieDetails = ({ movie }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startIndex, setStartIndex] = useState(0); // Tracks the starting index for the visible reviews
  const [showModal, setShowModal] = useState(false); // State for modal
  const [fullReview, setFullReview] = useState(""); // State for full review text
  const visibleCount = 3; // Number of reviews visible at a time

  useEffect(() => {
    const fetchReviews = async (movieId) => {
      try {
        const movieReviews = await getReviews(movieId);
        setReviews(movieReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to fetch reviews. Please try again later.");
        console.log(error)
      }
    };
    if (movie && movie.id) {
      fetchReviews(movie.id);
    }
  }, [movie, error]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError("Review text is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const newReview = await postReview({
        movie_id: movie.id,
        review_text: reviewText,
        rating,
      });
      setReviews((prevReviews) => [...prevReviews, newReview.review]);
      setReviewText("");
      setRating(0);
      setError("");
    } catch (err) {
      console.error("Error adding review:", err);
      setError("Failed to add review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handlePrev = () => {
    setStartIndex(
      (prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length
    );
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleReadMore = (review) => {
    setFullReview(review);
    setShowModal(true);
    document.body.classList.add("modal-open"); // Disable background scrolling
  };

  const closeModal = () => {
    setShowModal(false);
    setFullReview("");
    document.body.classList.remove("modal-open"); // Re-enable background scrolling
  };

  if (!movie) {
    return <p>No movie selected.</p>;
  }

  // Compute the visible reviews based on the current start index
  const visibleReviews = [];
  for (let i = 0; i < visibleCount; i++) {
    visibleReviews.push(reviews[(startIndex + i) % reviews.length]);
  }

  return (
    <div className={MovieDetailsStyles.container}>
      <div className={MovieDetailsStyles.movieDetails}>
        <img
          src={movie.image}
          alt={movie.title}
          className={MovieDetailsStyles.image}
        />
        <div className={MovieDetailsStyles.movieInfo}>
          <h1>{movie.title || "Untitled"}</h1>
          <p>{movie.synopsis || "No synopsis available."}</p>
          <p>
            <strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Rating:</strong> ⭐ {movie.rating || "N/A"}
          </p>
          <p>
            <strong>Year:</strong> {movie.releaseYear || "N/A"}
          </p>
          <div className={MovieDetailsStyles.reviewsContainer}>
            <h2>User Reviews</h2>
            {reviews.length > 0 ? (
              <div className={MovieDetailsStyles.carouselContainer}>
                <button
                  className={`${MovieDetailsStyles.carouselButton} ${MovieDetailsStyles.left}`}
                  onClick={handlePrev}
                >
                  ◀
                </button>
                <div className={MovieDetailsStyles.carouselContent}>
                  {visibleReviews.map((review, index) => (
                    <div key={index} className={MovieDetailsStyles.reviewCard}>
                      <p>
                        <strong>⭐ {review?.rating}/5</strong>
                      </p>
                      <p>
                        {review?.review_text.length > 100
                          ? `${review.review_text.slice(0, 100)}...`
                          : review.review_text}
                        {review?.review_text.length > 100 && (
                          <span
                            className={MovieDetailsStyles.readMore}
                            onClick={() => handleReadMore(review.review_text)}
                          >
                            Read More
                          </span>
                        )}
                      </p>
                      <small>— {review?.user_name}</small>
                    </div>
                  ))}
                </div>
                <button
                  className={`${MovieDetailsStyles.carouselButton} ${MovieDetailsStyles.right}`}
                  onClick={handleNext}
                >
                  ▶
                </button>
              </div>
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleAddReview}
        className={MovieDetailsStyles.reviewForm}
      >
        <h3>Add Your Review</h3>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          required
        />
        <div className={MovieDetailsStyles.starRating}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`${MovieDetailsStyles.star} ${
                i < rating ? MovieDetailsStyles.filled : ""
              }`}
              onClick={() => handleStarClick(i)}
            >
              ★
            </span>
          ))}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* Modal for Full Review */}
      {showModal && (
        <div className={MovieDetailsStyles.modal}>
          <div className={MovieDetailsStyles.modalContent}>
            <button
              onClick={closeModal}
              className={MovieDetailsStyles.modalCloseButton}
            >
              ×
            </button>
            <p className={MovieDetailsStyles.modalFullReview}>{fullReview}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
