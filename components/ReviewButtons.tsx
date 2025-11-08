'use client';

import { motion } from 'framer-motion';
import { REVIEW_OPTIONS } from '@/types/card';

interface ReviewButtonsProps {
  onReview: (quality: number) => void;
  disabled?: boolean;
}

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

const colorClasses = {
  error: 'bg-error hover:bg-error-light text-white',
  warning: 'bg-warning hover:bg-warning-light text-white',
  accent: 'bg-accent hover:bg-blue-500 text-white',
  success: 'bg-success hover:bg-success-light text-white',
};

export default function ReviewButtons({ onReview, disabled = false }: ReviewButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {REVIEW_OPTIONS.map((option) => (
        <motion.button
          key={option.value}
          variants={buttonVariants}
          whileHover={!disabled ? 'hover' : undefined}
          whileTap={!disabled ? 'tap' : undefined}
          onClick={() => !disabled && onReview(option.value)}
          disabled={disabled}
          className={`
            flex-1 py-3 px-4 rounded-lg font-semibold
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-md hover:shadow-lg
            ${colorClasses[option.color as keyof typeof colorClasses]}
          `}
          title={option.description}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-base">{option.label}</span>
            <span className="text-xs opacity-90 hidden sm:block">
              {option.description}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
