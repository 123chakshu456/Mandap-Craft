import { useState } from 'react';
import type { Dispatch, SetStateAction, FormEvent } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import './LoginPage.scss';

export default function LoginPage() {
  const { currentUser, setCurrentUser, showToast } = useOutletContext<{
    currentUser: { name: string; email: string } | null;
    setCurrentUser: Dispatch<SetStateAction<{ name: string; email: string } | null>>;
    showToast: (msg: string) => void;
  }>();

  const navigate = useNavigate();

  // Mode & Form state
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      if (!name || !email || !password) {
        showToast('Please fill out all fields.');
        return;
      }
      if (!agreeToTerms) {
        showToast('You must agree to the Terms of Service & Privacy Shield.');
        return;
      }
      
      // Simulate Register
      const newUser = { name, email };
      setCurrentUser(newUser);
      showToast(`Welcome to Mandap-Craft, ${name}! Your account has been created. 🎉`);
      navigate('/');
    } else {
      if (!email || !password) {
        showToast('Please enter both email and password.');
        return;
      }

      // Simulate Login
      const displayName = email.split('@')[0];
      const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      
      const loggedUser = { name: capitalized, email };
      setCurrentUser(loggedUser);
      showToast(`Welcome back, ${capitalized}! logged in successfully. ✨`);
      navigate('/');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.');
  };

  const handleGoogleLogin = () => {
    const googleUser = { name: 'Aryan Patel', email: 'aryan.patel@gmail.com' };
    setCurrentUser(googleUser);
    showToast('Signed in with Google successfully! 🌐');
    navigate('/');
  };

  if (currentUser) {
    return (
      <div className="login-page-wrapper">
        <div className="login-modal">
          <div className="modal-banner">
            <span className="brand-title">MANDAP·CRAFT</span>
            <span className="brand-subtitle">Privilege Profile</span>
          </div>
          <div className="profile-card">
            <div className="avatar">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <div className="name">{currentUser.name}</div>
              <div className="email">{currentUser.email}</div>
            </div>
            <div className="profile-actions">
              <button onClick={() => navigate('/')} className="btn-action">
                Return to Studio
              </button>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-modal">
        <div className="modal-banner">
          <span className="brand-title">MANDAP·CRAFT</span>
          <span className="brand-subtitle">Privilege Club Login</span>
        </div>
        
        <div className="modal-body">
          <h2>{isSignUp ? 'Create Privilege Account' : 'Welcome Back'}</h2>
          <p className="subtitle">
            {isSignUp 
              ? 'Join our premium circle of bespoke wedding design and luxury styling.' 
              : 'Sign in to access your saved visualizer templates and custom budget estimates.'
            }
          </p>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="name-input">Full Name</label>
                <div className="input-wrapper">
                  <UserIcon className="icon" />
                  <input
                    id="name-input"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email-input">Privilege Email</label>
              <div className="input-wrapper">
                <Mail className="icon" />
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password-input">Password</label>
              <div className="input-wrapper">
                <Lock className="icon" />
                <input
                  id="password-input"
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {isSignUp && (
              <div className="checkbox-group">
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
                <label htmlFor="terms-checkbox">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Shield Charter</a> of Mandap-Craft Luxury.
                </label>
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isSignUp ? 'Join Privilege' : 'Sign In'}
            </button>
          </form>

          <div className="divider">OR</div>

          <button type="button" onClick={handleGoogleLogin} className="google-btn">
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="switch-mode">
            <span>{isSignUp ? 'Already a Privilege Club member?' : 'New to Mandap-Craft?'}</span>
            <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
