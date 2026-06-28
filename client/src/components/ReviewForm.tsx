import { useState } from 'react';
import { reviewsAPI } from '../api/client';

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  user?: { name: string };
  createdAt: string;
}

interface ReviewFormProps {
  productId: string;
  onReviewAdded: (review: Review) => void;
}

const ReviewForm = ({ productId, onReviewAdded }: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await reviewsAPI.create({ productId, rating, comment });
      onReviewAdded(response.data);
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-4">
      <h3 className="font-bold mb-3">Write a Review</h3>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        >
          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
          <option value="4">⭐⭐⭐⭐ Good</option>
          <option value="3">⭐⭐⭐ Average</option>
          <option value="2">⭐⭐ Poor</option>
          <option value="1">⭐ Terrible</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full border rounded px-3 py-2"
          rows={3}
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-amazon-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
