import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

export default function UserDetails({form,setForm,handleSave}){
      const roles = [
    { label: 'admin', value: 'admin' },
    { label: 'user', value: 'user' }
  ];

  const [errors, setErrors] = useState({});

  useEffect(() => {

    setErrors({});

  }, [form]);

   const validateField = (name, value) => {
    let message = '';
    if (!value || value.trim() === '') {
      switch (name) {
        case 'username':
          message = 'יש להזין שם משתמש';
          break;
        case 'email':
          message = 'יש להזין אימייל';
          break;
        case 'password':
          message = 'יש להזין סיסמה';
          break;
        case 'role':
          message = 'יש לבחור תפקיד';
          break;
        default:
          break;
      }
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };


    return (<>
    <form
  onSubmit={(e) => {
    e.preventDefault();
    handleSave();       
  }}
>
  <div className="p-fluid">
          <label>שם משתמש</label>
          <InputText
            value={form.username}
            required
            onChange={(e) => handleChange('username', e.target.value)}
          />
          {errors.username && <small className="p-error">{errors.username}</small>}
          <label>אימייל</label>
          <InputText
            value={form.email}
            type="email"
            required
            onChange={(e) => handleChange('email', e.target.value)}
          />
         {errors.email && <small className="p-error">{errors.email}</small>}
          <label>סיסמה</label>
          <InputText
            type="password"
            required
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          {errors.password && <small className="p-error">{errors.password}</small>}
          <label>תפקיד</label>
          <Dropdown
            value={form.role}
            options={roles}
            onChange={(e) => handleChange('role', e.value)}
          />
           {errors.role && <small className="p-error">{errors.role}</small>}
        </div>
        </form>
    </>)
}