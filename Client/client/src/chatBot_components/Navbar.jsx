import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ isAdmin }) {
  const navigate = useNavigate();

  const items = [
    { label: 'צ׳אט', icon: 'pi pi-comments', command: () => navigate('/') },
  ];

  if (isAdmin) {
    items.push(
      { label: 'משתמשים', icon: 'pi pi-users', command: () => navigate('/admin/users') },
      { label: 'הודעות', icon: 'pi pi-envelope', command: () => navigate('/admin/messages') }
    );
  }

  items.push({ label: 'התנתקות', icon: 'pi pi-sign-out', command: () => {
    localStorage.clear();
    navigate('/auth');
  }});

  const start = <img alt="logo" src="/logo.png" height="40" className="mr-2" />;

  return <Menubar model={items} start={start} />;
}
