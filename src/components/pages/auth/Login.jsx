import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';
import { login } from '../../utils/Api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login({ email, password });

      if (response.data.success) {
        const userRole = response.data.user?.roles?.includes('admin')
          ? 'admin'
          : response.data.user?.roles?.[0];

        if (userRole === 'admin') {
          Cookies.set('token', response.data.token, { expires: 7 });
          Cookies.set('userRole', userRole, { expires: 7 });
          navigate('/dashboard');
        } else {
          setError('Access denied. Admin privileges required.');
          Cookies.remove('token');
          Cookies.remove('userRole');
        }
      } else {
        setError(response.data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          overflow: hidden;
        }

        /* ── Left panel ── */
        .left-panel {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 56px;
          overflow: hidden;
        }

        .left-bg {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom, rgba(15,23, 42,0.2) 0%, rgba(30,41,59,0.8) 100%),
            url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80') center/cover no-repeat;
        }

        .geo-overlay {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 80px,
            rgba(59, 130, 246,0.04) 80px,
            rgba(59, 130, 246,0.04) 81px
          );
        }

        .brand-badge {
          position: absolute;
          top: 48px;
          left: 56px;
          display: flex;
          align-items: center;
          gap: 14px;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? '0' : '-8px'});
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .brand-mark {
          width: 38px;
          height: 38px;
          border: 1.5px solid rgba(59, 130, 246, 0.7);
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        .brand-mark-inner {
          width: 14px;
          height: 14px;
          background: rgba(59, 130, 246, 0.8);
        }

        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 400;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.95);
          text-transform: uppercase;
        }

        .left-content {
          position: relative;
          z-index: 1;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? '0' : '16px'});
          transition: opacity 1s ease 0.3s, transform 1s ease 0.3s;
        }

        .left-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(59, 130, 246, 0.9);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .left-eyebrow::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: rgba(59, 130, 246, 0.6);
        }

        .left-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 4vw, 62px);
          font-weight: 300;
          line-height: 1.12;
          color: #f8fafc;
          margin-bottom: 24px;
        }

        .left-headline em {
          font-style: italic;
          color: rgba(59, 130, 246, 0.9);
        }

        .left-sub {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          max-width: 340px;
        }

        .left-rule {
          width: 48px;
          height: 1px;
          background: rgba(59, 130, 246, 0.4);
          margin-top: 32px;
        }

        /* ── Right panel ── */
        .right-panel {
          width: 480px;
          min-height: 100vh;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 52px;
          position: relative;
          flex-shrink: 0;
          opacity: ${mounted ? 1 : 0};
          transform: translateX(${mounted ? '0' : '24px'});
          transition: opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s;
          box-shadow: -10px 0 50px rgba(0, 0, 0, 0.1);
        }

        .right-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.4) 30%, rgba(59, 130, 246, 0.4) 70%, transparent);
        }

        .form-eyebrow {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(59, 130, 246, 0.9);
          margin-bottom: 10px;
        }

        .form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 400;
          color: #1e293b;
          line-height: 1.15;
          margin-bottom: 6px;
        }

        .form-subtitle {
          font-size: 14px;
          font-weight: 400;
          color: #64748b;
          letter-spacing: 0.03em;
          margin-bottom: 44px;
        }

        .error-bar {
          background: #fef2f2;
          border-left: 3px solid #dc2626;
          padding: 14px 16px;
          margin-bottom: 24px;
          font-size: 13px;
          font-weight: 500;
          color: #dc2626;
          letter-spacing: 0.03em;
          border-radius: 0 4px 4px 0;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
        }

        .field-group {
          margin-bottom: 28px;
        }

        .field-label {
          display: block;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 10px;
        }

        .field-wrap {
          position: relative;
        }

        .field-input {
          width: 100%;
          padding: 14px 44px 14px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.04em;
          outline: none;
          border-radius: 8px;
          transition: all 0.25s ease;
          -webkit-appearance: none;
        }

        .field-input::placeholder {
          color: #94a3b8;
          font-weight: 300;
        }

        .field-input:focus {
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .field-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }

        .field-icon:hover {
          color: #3b82f6;
          transform: translateY(-50%) scale(1.1);
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
        }

        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(59, 130, 246, 0.35);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.25);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .submit-btn-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          transform: translateX(-100%);
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .loading-dots {
          display: inline-flex;
          gap: 5px;
          align-items: center;
        }

        .loading-dots span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #f7f3ee;
          animation: dot-pulse 1.2s ease-in-out infinite;
        }

        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dot-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }

        .form-footer {
          margin-top: 40px;
          padding-top: 28px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-note {
          font-size: 12px;
          font-weight: 400;
          color: #64748b;
          letter-spacing: 0.05em;
        }

        .footer-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #64748b;
        }

        .footer-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        /* Responsive */
        @media (max-width: 860px) {
          .left-panel { display: none; }
          .right-panel {
            width: 100%;
            min-height: 100vh;
            padding: 48px 32px;
          }
        }
      `}</style>

      <div className="login-root">
        {/* ── Left decorative panel ── */}
        <div className="left-panel">
          <div className="left-bg" />
          <div className="geo-overlay" />

          <div className="brand-badge">
            <div className="brand-mark">
              <div className="brand-mark-inner" />
            </div>
            <span className="brand-name">Patil Associates</span>
          </div>

          <div className="left-content">
            <p className="left-eyebrow">Administration Portal</p>
            <h1 className="left-headline">
              Manage your<br />
              <em>Buisness</em><br />
              with precision
            </h1>
            <p className="left-sub">
              A unified platform for properties, bookings, restaurants, and guest experience management.
            </p>
            <div className="left-rule" />
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="right-panel">
          <div>
            <p className="form-eyebrow">Secure Access</p>
            <h2 className="form-title">Welcome back</h2>
            <p className="form-subtitle">Sign in to your administrator account</p>
          </div>

          {error && (
            <div className="error-bar" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="email" className="field-label">Email Address</label>
              <div className="field-wrap">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-input"
                  placeholder="admin@patilassociates.in"
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="password" className="field-label">Password</label>
              <div className="field-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-input"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="field-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading && <div className="submit-btn-shimmer" />}
              {loading ? (
                <span className="loading-dots">
                  <span /><span /><span />
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="form-footer">
            <span className="footer-note">© 2025 Patil Associates</span>
            <span className="footer-badge">
              <span className="footer-badge-dot" />
              Secured
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;