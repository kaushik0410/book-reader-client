import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    // const res = await fetch('http://localhost:5000/api/login', {
    const res = await fetch('https://book-reader-server-a6uv.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="auth-form">
      <h2>Login into Book Reader</h2>
      <input type="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p className="switch-auth">
        Don't have an account?{' '}
        <span className="auth-link" onClick={() => navigate('/register')}>
          Create account
        </span>
      </p>
    </div>
  );
}

export default Login;