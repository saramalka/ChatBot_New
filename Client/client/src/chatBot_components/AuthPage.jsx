import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useLoginMutation, useRegisterMutation } from '../features/auth/authApi';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const action = isLogin ? login : register;
      const res = await action(form).unwrap();
      if (res.token) localStorage.setItem('token', res.token);
      window.location.href = '/';
    } catch (err) {
      alert(err.data?.msg || 'שגיאה');
    }
  };

  return (
    <div className="flex justify-content-center align-items-center h-screen">
      <Card title={isLogin ? 'התחברות' : 'הרשמה'} className="w-25rem">
        {!isLogin && (
          <div className="mb-3">
            <label>שם משתמש</label>
            <InputText name="username" className="w-full" onChange={handleChange} />
          </div>
        )}
        <div className="mb-3">
          <label>אימייל</label>
          <InputText name="email" className="w-full" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>סיסמה</label>
          <Password name="password" className="w-full" feedback={false} onChange={handleChange} />
        </div>
        <Button label={isLogin ? 'התחבר' : 'הרשם'} className="w-full mb-2" onClick={handleSubmit} />
        <Button
          link
          className="w-full"
          label={isLogin ? 'אין לך חשבון? הרשם' : 'כבר רשום? התחבר'}
          onClick={() => setIsLogin(!isLogin)}
        />
      </Card>
    </div>
  );
}
