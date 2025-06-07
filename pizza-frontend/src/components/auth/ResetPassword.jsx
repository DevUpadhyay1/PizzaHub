import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '15px',
      padding: '40px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center'
    },
    pizzaIcon: {
      fontSize: '3rem',
      marginBottom: '20px'
    },
    title: {
      color: '#333',
      marginBottom: '10px',
      fontSize: '2rem',
      fontWeight: '600'
    },
    description: {
      color: '#666',
      marginBottom: '30px',
      lineHeight: '1.5'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      textAlign: 'left'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#333',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
      color: 'white',
      border: 'none',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: (loading || !token) ? 'not-allowed' : 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      opacity: (loading || !token) ? 0.7 : 1
    },
    errorMessage: {
      background: '#ffebee',
      color: '#c62828',
      padding: '12px',
      borderRadius: '8px',
      borderLeft: '4px solid #c62828',
      fontSize: '14px'
    },
    successMessage: {
      background: '#e8f5e8',
      color: '#2e7d32',
      padding: '12px',
      borderRadius: '8px',
      borderLeft: '4px solid #2e7d32',
      fontSize: '14px'
    },
    backToLogin: {
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #eee'
    },
    link: {
      color: '#ff6b6b',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.3s ease'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontSize: '18px',
      color: '#666'
    }
  };

  useEffect(() => {
    // Extract token from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('token');
    
    if (!resetToken) {
      setError('Invalid reset link');
      return;
    }
    
    setToken(resetToken);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        newPassword: password
      });

      setMessage(response.data.message);
      
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.pizzaIcon}>🍕</div>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.description}>Enter your new password below.</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#ff6b6b'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
              minLength="6"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#ff6b6b'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
              minLength="6"
              required
            />
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}
          {message && <div style={styles.successMessage}>{message}</div>}

          <button 
            type="submit" 
            style={styles.submitBtn}
            disabled={loading || !token}
            onMouseEnter={(e) => {
              if (!loading && token) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 15px rgba(255, 107, 107, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div style={styles.backToLogin}>
          <a 
            href="/login" 
            style={styles.link}
            onMouseEnter={(e) => {
              e.target.style.color = '#ff5252';
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#ff6b6b';
              e.target.style.textDecoration = 'none';
            }}
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;