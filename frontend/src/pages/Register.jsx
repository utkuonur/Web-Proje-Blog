import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/user/register', formData);
      alert("Kayıt başarılı! Şimdi giriş yapabilirsin.");
      navigate('/login');
    } catch (err) { alert("Kayıt olunamadı!"); }
  };

  return (
    <div style={{ width: '100%', maxWidth: '450px', margin: 'auto' }}>
      <form onSubmit={handleRegister} style={styles.card}>
        <h2>Kayıt Ol</h2>
        <input placeholder="Ad" onChange={e => setFormData({ ...formData, firstName: e.target.value })} style={styles.input} required />
        <input placeholder="Soyad" onChange={e => setFormData({ ...formData, lastName: e.target.value })} style={styles.input} required />
        <input type="email" placeholder="E-posta" onChange={e => setFormData({ ...formData, email: e.target.value })} style={styles.input} required />
        <input type="password" placeholder="Şifre" onChange={e => setFormData({ ...formData, password: e.target.value })} style={styles.input} required />
        <button type="submit" style={{ ...styles.btn, width: '100%' }}>Hesap Oluştur</button>
      </form>
    </div>
  );
};

export default Register;