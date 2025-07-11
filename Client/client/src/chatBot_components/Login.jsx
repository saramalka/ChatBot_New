import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../slices/authSlice';
import '../styles/AuthPage.css';
import {
  useLoginUserMutation,
  useAddUserMutation,
  useCheckEmailMutation,
} from '../features/admin/userApiSlice';

export default function Login() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate();

  const [loginUser] = useLoginUserMutation();
  const [addUser] = useAddUserMutation();
  const [checkEmail] = useCheckEmailMutation();

const handleChange = (e) => {
  const { name, value } = e.target;
  setErrorMsg('');
  setForm((prev) => ({ ...prev, [name]: value }));
};

  const dispatch = useDispatch();
  const handleLogin = async () => {
    try {
      const res = await loginUser(form).unwrap();
      dispatch(setToken({
      name: res.username,
      token: res.token,
      role: res.role
    }));
      console.log('התחברות בוצעה בהצלחה');
      navigate('/chat');
    } catch (err) {
      console.error(err);
      console.log('שגיאה בהתחברות');
      setErrorMsg('שם המשתמש או הסיסמה אינם נכונים');
    }
  };

  const registerAndLogin = async () => {
    try {
      await addUser(form).unwrap();
      handleLogin();
    } catch (err) {
      console.error(err);
      console.log('שגיאה בהרשמה');
      setErrorMsg('ההרשמה נכשלה. נא לנסות שוב.');
    }
  };

  const handleSubmit = async (e) => {
    setErrorMsg('');
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
      console.log('שגיאה בבדיקת משתמש');
      setErrorMsg('שגיאה בבדיקת המשתמש. נא לנסות שוב.');
    }
  };

  return (
    <div className="login-container">
      <div className="title"> ברוכים הבאים לאתר תזונה בריאה!</div>
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
        {errorMsg && <div className="error-message">{errorMsg}</div>}
      </form>
    </div>
  );
}
