import React, { useState } from 'react';
import { Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

interface SignUpProps {
  onSwitchToLogin: () => void;
  onSignUpSuccess: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToLogin, onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignUpSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-card rounded-2xl shadow-xl border border-dark-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
            <p className="text-secondary text-sm">Sign up to start using FinDash</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-dark-accent border border-dark-border text-primary pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green/50 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-dark-accent border border-dark-border text-primary pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green/50 transition-all"
                  placeholder="Create a password (min. 6 characters)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-dark-accent border border-dark-border text-primary pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green/50 transition-all"
                  placeholder="Confirm your password"
                />
              </div>
              {confirmPassword && password === confirmPassword && confirmPassword.length >= 6 && (
                <div className="mt-2 flex items-center gap-2 text-brand-green text-xs">
                  <CheckCircle size={14} />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-green to-brand-greenDark text-black py-3 rounded-xl font-semibold hover:shadow-[0_0_15px_rgba(159,182,178,0.4)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-secondary text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-brand-green hover:text-brand-lightGreen font-medium transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

