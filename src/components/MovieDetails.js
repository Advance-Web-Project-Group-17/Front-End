import React, { useEffect, useState } from "react";
import { getReviews, postReview } from "../services/ReviewService.js";
import MovieDetailsStyles from "../Screen/LandingPage/MovieDetails.module.css";

const MovieDetails = ({ movie }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullReview, setFullReview] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const visibleCount = 3;

  // Fetch reviews from the backend
  const fetchReviews = async (movieId) => {
    try {
      const movieReviews = await getReviews(movieId);
      setReviews(movieReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to fetch reviews. Please try again later.");
    }
  };

  useEffect(() => {
    if (movie && movie.id) {
      fetchReviews(movie.id);
    }
  }, [movie]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError("Review text is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      await postReview({
        movie_id: movie.id,
        review_text: reviewText,
        rating,
      });

      // Reset form fields
      setReviewText("");
      setRating(0);
      setError("");
      setShowConfirmation(true);

      // Fetch updated reviews after submission
      await fetchReviews(movie.id);
    } catch (err) {
      console.error("Error adding review:", err);
      setError("Failed to add review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleReadMore = (review) => {
    setFullReview(review);
    setShowModal(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setShowModal(false);
    setShowConfirmation(false);
    setFullReview("");
    document.body.classList.remove("modal-open");
  };

  const handleNext = () => {
    if (reviews.length > visibleCount) {
      setStartIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }
  };

  const handlePrev = () => {
    if (reviews.length > visibleCount) {
      setStartIndex(
        (prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length
      );
    }
  };

  const getVisibleReviews = () => {
    const visibleReviews = [];
    if (reviews.length > visibleCount) {
      // Circular buffer logic when reviews > visibleCount
      for (let i = 0; i < visibleCount; i++) {
        visibleReviews.push(reviews[(startIndex + i) % reviews.length]);
      }
    } else {
      // Static empty slots when reviews <= visibleCount
      for (let i = 0; i < visibleCount; i++) {
        visibleReviews.push(reviews[i] || null);
      }
    }
    return visibleReviews;
  };

  const visibleReviews = getVisibleReviews();

  if (!movie) {
    return <p>No movie selected.</p>;
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
                {reviews.length > visibleCount && (
                  <button
                    className={`${MovieDetailsStyles.carouselButton} ${MovieDetailsStyles.left}`}
                    onClick={handlePrev}
                  >
                    ◀
                  </button>
                )}
                <div className={MovieDetailsStyles.carouselContent}>
                  {visibleReviews.map((review, index) =>
                    review ? (
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
                    ) : (
                      <div
                        key={index}
                        className={`${MovieDetailsStyles.reviewCard} ${MovieDetailsStyles.emptyCard}`}
                      />
                    )
                  )}
                </div>
                {reviews.length > visibleCount && (
                  <button
                    className={`${MovieDetailsStyles.carouselButton} ${MovieDetailsStyles.right}`}
                    onClick={handleNext}
                  >
                    ▶
                  </button>
                )}
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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className={MovieDetailsStyles.modal}>
          <div className={MovieDetailsStyles.modalContentConfirm}>
            <p>Review submitted successfully!</p>
            <button
              onClick={closeModal}
              className={MovieDetailsStyles.modalCloseButton}
            >
              x
            </button>
          </div>
        </div>
      )}

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
