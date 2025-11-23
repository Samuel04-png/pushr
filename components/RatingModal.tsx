import React, { useState } from 'react';
import { Sheet, Button, Badge } from './UI';
import { Star, MessageSquare, X, CheckCircle2 } from 'lucide-react';

export interface RatingData {
  stars: number;
  comment: string;
  tags?: string[];
}

const RATING_TAGS = [
  'Fast Delivery',
  'Professional',
  'Friendly',
  'Careful',
  'On Time',
  'Great Communication',
];

export const RatingModal = ({
  isOpen,
  onClose,
  onSubmit,
  pusherName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: RatingData) => void;
  pusherName?: string;
}) => {
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = () => {
    if (stars === 0) {
      alert('Please select a rating');
      return;
    }
    
    onSubmit({
      stars,
      comment,
      tags: selectedTags,
    });
    
    setStars(0);
    setComment('');
    setSelectedTags([]);
    onClose();
    
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Rate Your Delivery"
      size="md"
    >
      <div className="space-y-6">
        {/* Pusher Info */}
        {pusherName && (
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <p className="text-sm text-gray-600 mb-1">How was your experience with</p>
            <p className="font-bold text-lg text-gray-900">{pusherName}?</p>
          </div>
        )}

        {/* Star Rating */}
        <div className="text-center">
          <div className="flex justify-center space-x-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setStars(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="touch-feedback active:scale-110 transition-transform"
              >
                <Star
                  size={48}
                  className={`transition-all duration-200 ${
                    star <= (hoveredStar || stars)
                      ? 'fill-yellow-400 text-yellow-400 scale-110'
                      : 'fill-gray-200 text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          {stars > 0 && (
            <p className="text-sm font-semibold text-gray-700 animate-slide-down">
              {stars === 5 && '⭐⭐⭐⭐⭐ Excellent!'}
              {stars === 4 && '⭐⭐⭐⭐ Great!'}
              {stars === 3 && '⭐⭐⭐ Good'}
              {stars === 2 && '⭐⭐ Fair'}
              {stars === 1 && '⭐ Poor'}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            What made this delivery great?
          </label>
          <div className="flex flex-wrap gap-2">
            {RATING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all touch-feedback active:scale-95 ${
                  selectedTags.includes(tag)
                    ? 'bg-pushr-blue text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Add a comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-pushr-blue focus:ring-2 focus:ring-pushr-blue/20 outline-none transition-all resize-none text-sm sm:text-base"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={stars === 0}
          icon={<CheckCircle2 size={18} />}
        >
          Submit Rating
        </Button>
      </div>
    </Sheet>
  );
};

