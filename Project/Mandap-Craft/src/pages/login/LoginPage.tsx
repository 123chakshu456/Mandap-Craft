import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction, FormEvent } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Loader2, AlertCircle } from 'lucide-react';
import { authApi } from '../../services/api';
import './LoginPage.scss';

export default function LoginPage() {
  const { currentUser, setCurrentUser, showToast } = useOutletContext<{
    currentUser: { name: string; email: string; id?: string } | null;
    setCurrentUser: Dispatch<SetStateAction<{ name: string; email: string; id?: string } | null>>;
    showToast: (msg: string) => void;
  }>();

  const navigate = useNavigate();

  // Mode & Form state
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Default to true so that `#google-btn-slot` is rendered in DOM initially
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(true);

  // Initialize Google Identity Services
  useEffect(() => {
    let checkInterval: ReturnType<typeof setInterval>;

    const initGoogleGSI = async () => {
      try {
        const clientId = await authApi.getGoogleClientId();
        if (!clientId || clientId === 'your_google_client_id_here') {
          console.warn('Google Client ID is not configured.');
          setIsGoogleConfigured(false);
          return;
        }

        setIsGoogleConfigured(true);

        const google = (window as any).google;
        if (google?.accounts?.id) {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
          });

          // Render the official Google Sign-In button in slot
          google.accounts.id.renderButton(
            document.getElementById('google-btn-slot'),
            { theme: 'outline', size: 'large', width: 334, text: 'continue_with' }
          );
        }
      } catch (err) {
        console.error('Failed to load Google GSI:', err);
      }
    };

    const google = (window as any).google;
    if (google?.accounts?.id) {
      initGoogleGSI();
    } else {
      checkInterval = setInterval(() => {
        const google = (window as any).google;
        if (google?.accounts?.id) {
          clearInterval(checkInterval);
          initGoogleGSI();
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    setIsLoading(true);
    try {
      const res = await authApi.googleLogin(response.credential);
      setCurrentUser(res.user);
      showToast('Signed in with Google Privilege ID! 🌐');
      navigate('/');
    } catch (err: any) {
      showToast(`❌ Google Authentication failed: ${err.message || 'Error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isSignUp) {
      if (!name || !email || !password) {
        showToast('Please fill out all fields.');
        return;
      }
      if (!agreeToTerms) {
        showToast('You must agree to the Terms of Service & Privacy Shield.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await authApi.register({ name, email, password });
        setCurrentUser(response.user);
        showToast(`Welcome to Mandap-Craft, ${response.user.name || name}! Your privilege account is ready. 🎉`);
        navigate('/');
      } catch (err: any) {
        const msg = err.message || 'Registration failed. Please try again.';
        setErrorMessage(msg);
        showToast(`❌ ${msg}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!email || !password) {
        showToast('Please enter both email and password.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await authApi.login({ email, password });
        setCurrentUser(response.user);
        showToast(`Welcome back, ${response.user.name || response.user.email}! Signed in successfully. ✨`);
        navigate('/');
      } catch (err: any) {
        const msg = err.message || 'Invalid email or password.';
        setErrorMessage(msg);
        showToast(`❌ ${msg}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue even if network error
    }
    setCurrentUser(null);
    showToast('Logged out successfully.');
  };

  // Mock handler removed to enforce real Google authentication flow

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
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="profile-info">
              <div className="name">{currentUser.name || 'Privilege Member'}</div>
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

          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

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

            <button type="submit" className="submit-btn" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading 
                ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                : (isSignUp ? 'Join Privilege' : 'Sign In')
              }
            </button>
          </form>

          <div className="divider">OR</div>

          <div style={{ display: isGoogleConfigured ? 'flex' : 'none', justifyContent: 'center', width: '100%', margin: '12px 0 20px 0' }}>
            <div id="google-btn-slot"></div>
          </div>
          {!isGoogleConfigured && (
            <div className="google-btn-not-configured" style={{
              textAlign: 'center',
              padding: '12px 16px',
              border: '1px dashed rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              color: '#ef4444',
              fontSize: '13px',
              lineHeight: '1.5',
              marginBottom: '20px'
            }}>
              <strong>Google Sign-In is not configured:</strong> Please configure a valid <code>GOOGLE_CLIENT_ID</code> in the backend <code>.env</code> file.
            </div>
          )}

          <div className="switch-mode">
            <span>{isSignUp ? 'Already a Privilege Club member?' : 'New to Mandap-Craft?'}</span>
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(null); }}>
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
