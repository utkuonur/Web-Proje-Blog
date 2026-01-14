import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/user/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      navigate('/');
    } catch (err) { alert("Giriş başarısız!"); }
  };

  return (
    <div style={{ width: '100%', maxWidth: '450px', margin: 'auto' }}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2>Giriş Yap</h2>
        <input type="email" placeholder="E-posta" onChange={e => setEmail(e.target.value)} style={styles.input} required />
        <input type="password" placeholder="Şifre" onChange={e => setPassword(e.target.value)} style={styles.input} required />
        <button type="submit" style={{ ...styles.btn, width: '100%' }}>Giriş</button>
      </form>
    </div>
  );
};

export default Login;