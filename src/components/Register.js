import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      navigate('/dashboard');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <div className="auth-form">
      <h2>Register to Book Reader</h2>
      <input type="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <p className="switch-auth">
        Already have an account?{' '}
        <span className="auth-link" onClick={() => navigate('/')}>
          Login here
        </span>
      </p>
    </div>
  );
}

export default Register;