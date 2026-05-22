'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onBack: () => void;
}

export function ForgotPasswordForm({ onSubmit, onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    await onSubmit(email);
    setIsSubmitting(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold mb-2">Forgot Password?</h3>
        <p className="text-sm text-text/60">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
      </div>

      {/* Email */}
      <div>
        <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="w-full bg-white border border-gray-300 p-3 pl-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm"
            placeholder="your@email.com"
            disabled={isSubmitting}
          />
        </div>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>

      {/* Buttons */}
      <div className="flex items-center flex-col gap-3">
        <button
          type="submit"
          className="px-8 py-4 btn-dark text-white text-[10px] uppercase tracking-ultra rounded-full hover:bg-gold/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending Code...
            </>
          ) : (
            'Send Reset Code'
          )}
        </button>
        
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 text-sm text-link transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-link" />
          Back to Sign In
        </button>
      </div>
    </motion.form>
  );
}