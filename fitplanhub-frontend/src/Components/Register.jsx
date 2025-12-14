import { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'auto'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: 'clamp(24px, 5vw, 40px)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 28px)',
          fontWeight: '600',
          color: '#0f172a',
          marginBottom: 'clamp(24px, 4vw, 32px)',
          textAlign: 'center'
        }}>
          FIT-PLAN-HUB
        </h1>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#f0fdf4',
            color: '#16a34a',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: 'clamp(14px, 2vw, 15px)',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: 'clamp(14px, 2vw, 15px)',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: 'clamp(14px, 2vw, 15px)',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: '100%',
              padding: 'clamp(10px, 2vw, 12px)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: 'clamp(14px, 2vw, 15px)',
              boxSizing: 'border-box',
              outline: 'none',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="USER">USER</option>
            <option value="TRAINER">TRAINER</option>
          </select>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%',
            padding: 'clamp(10px, 2vw, 12px)',
            backgroundColor: loading ? '#94a3b8' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: 'clamp(14px, 2vw, 15px)',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          Already have an account?{' '}
          <a href="/login" style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}