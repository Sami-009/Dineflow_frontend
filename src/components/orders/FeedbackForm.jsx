// FeedbackForm.jsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { submitFeedback } from '../../services/feedbackService';

export const FeedbackForm = ({ order, token, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await submitFeedback(
        {
          order_id: order.id,
          rating,
          comment: comment.trim(),
        },
        token
      );
      onFeedbackSubmitted?.(response.feedback);
    } catch (err) {
      console.error('Feedback submission failed:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Rate your Order
        </label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 rounded-full text-gray-300 hover:scale-110 transition-transform focus:outline-none"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  value <= (hoveredRating || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2" htmlFor={`comment-${order.id}`}>
          Comment
        </label>
        <textarea
          id={`comment-${order.id}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          placeholder="Share your experience (food taste, service portion, preparation)..."
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-sm"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
        {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
      </div>
    </form>
  );
};

export default FeedbackForm;
