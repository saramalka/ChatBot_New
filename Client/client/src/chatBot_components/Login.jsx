import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuthPage.css'; // Assuming you have a CSS file for styles

  export default function Login() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.name);
      navigate('/chat');
    } catch (error) {
      alert('שגיאה בהתחברות');
    }
  };

  const registerAndLogin = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/register', form);
      handleLogin();
    } catch {
      alert('שגיאה בהרשמה');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:3000/api/auth/check-user?email=${form.email}`);
      if (res.data.exists) {
        handleLogin();
      } else {
        registerAndLogin();
      }
    } catch {
      alert('שגיאה בבדיקת משתמש');
    }
  };

  return (
    <div className="login-container">
      <h2>התחברות / הרשמה</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">שם מלא:</label>
        <input type="text" id="name" name="name" value={form.name} onChange={handleChange} placeholder="שם מלא" required />

        <label htmlFor="email">אימייל:</label>
        <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="example@email.com" required />

        <label htmlFor="password">סיסמה:</label>
        <input type="password" id="password" name="password" value={form.password} onChange={handleChange} placeholder="******" required />

        <button type="submit">כניסה / הרשמה</button>
      </form>
    </div>
  );
};

