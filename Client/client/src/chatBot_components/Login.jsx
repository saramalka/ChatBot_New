import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthPage.css';
import {
  useLoginUserMutation,
  useAddUserMutation,
  useCheckEmailMutation,
} from '../features/admin/userApiSlice';

export default function Login() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const [loginUser] = useLoginUserMutation();
  const [addUser] = useAddUserMutation();
  const [checkEmail] = useCheckEmailMutation();

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};


  const handleLogin = async () => {
    try {
      const res = await loginUser(form).unwrap();
      console.log('Login successful:', res);
      localStorage.setItem('token', res.token);
      localStorage.setItem('userName', res.username);
      navigate('/chat');
    } catch (err) {
      console.error(err);
      alert('שגיאה בהתחברות');
    }
  };

  const registerAndLogin = async () => {
    try {
      await addUser(form).unwrap();
      handleLogin();
    } catch (err) {
      console.error(err);
      alert('שגיאה בהרשמה');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await checkEmail(form.email).unwrap();
      if (res.exists) {
        handleLogin();
      } else {
        registerAndLogin();
      }
    } catch (err) {
      console.error(err);
      alert('שגיאה בבדיקת משתמש');
    }
  };

  return (
    <div className="login-container">
      <h2>התחברות / הרשמה</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">שם מלא:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="שם מלא"
          required
        />

        <label htmlFor="email">אימייל:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@email.com"
          required
        />

        <label htmlFor="password">סיסמה:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="******"
          required
        />

        <button type="submit">כניסה / הרשמה</button>
      </form>
    </div>
  );
}
