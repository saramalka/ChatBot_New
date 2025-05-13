import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useLoginMutation, useRegisterMutation } from '../features/auth/authApi';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [login] = useLoginMutation();
  const [registerUser] = useRegisterMutation();

  const onSubmit = async (data) => {
    try {
      const action = isLogin
        ? login({ email: data.email, password: data.password })
        : registerUser(data);
      const res = await action.unwrap();

      if (res.token) localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res));
      window.location.href = '/';
    } catch (err) {
      alert(err?.data?.msg || 'שגיאה בעת התחברות/הרשמה');
      console.log(err);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center h-screen">
      <Card title={isLogin ? 'התחברות' : 'הרשמה'} className="w-25rem">
        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <div className="mb-3">
              <label>שם משתמש</label>
              <InputText
                name="username"
                className="w-full"
                {...register('username', { required: !isLogin })}
              />
              {errors.username && (
                <small className="p-error">יש להזין שם משתמש</small>
              )}
            </div>
          )}
          <div className="mb-3">
            <label>אימייל</label>
            <InputText
              name="email"
              className="w-full"
              {...register('email', {
                required: 'יש להזין אימייל',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'אימייל לא תקין',
                },
              })}
            />
            {errors.email && (
              <small className="p-error">{errors.email.message}</small>
            )}
          </div>
          <div className="mb-3">
            <label>סיסמה</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'יש להזין סיסמה',
                // minLength: {
                //   value: 3,
                //   message: 'סיסמה חייבת להכיל לפחות 3 תווים',
                // },
              }}
              render={({ field }) => (
                <Password
                  {...field}
                  className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                  feedback={false}
                />
              )}
            />
              {errors.password && (
                <small className="p-error">{errors.password.message}</small>
              )}
          </div>
          <Button
            label={isLogin ? 'התחבר' : 'הרשם'}
            className="w-full mb-2"
            type="submit"
          />
          <Button
            link
            className="w-full"
            label={isLogin ? 'אין לך חשבון? הרשם' : 'כבר רשום? התחבר'}
            onClick={() => setIsLogin(!isLogin)}
            type="button"
          />
        </form>
      </Card>
    </div>
  );
}
