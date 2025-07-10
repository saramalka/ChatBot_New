import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../slices/authSlice';
import { useDispatch } from 'react-redux';

export default function Navbar({ isAdmin }) {
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const items = [
    { label: 'צ׳אט', icon: 'pi pi-comments', command: () => navigate('/') },
  ];

  if (isAdmin) {
    items.push(
      { label: 'משתמשים', icon: 'pi pi-users', command: () => navigate('/admin/users') },
      { label: 'הודעות', icon: 'pi pi-envelope', command: () => navigate('/admin/messages') },
      { label: 'תשובות קבועות', icon: 'pi pi-envelope', command: () => navigate('/admin/replies') }
    );
  }

  items.push({ label: 'התנתקות', icon: 'pi pi-sign-out', command: () => {
    localStorage.clear();
    dispatch(removeToken());
    navigate('/');
  }});

  const start = <img alt="logo" src="http://localhost:2200/logo.png" height="40" className="mr-2" />;

  return <Menubar model={items} start={start} />;
}
