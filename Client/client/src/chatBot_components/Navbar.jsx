import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../slices/authSlice';
import { useDispatch ,useSelector} from 'react-redux';
import '../styles/navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const role = useSelector(state => state.auth.role);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const isAdmin = role === 'admin';

  const items = [
    { label: 'צ׳אט', icon: 'pi pi-comments', command: () =>  {
      if (isLoggedIn) {
        navigate('/chat');
      } else {
        alert('you hove to register')
        navigate('/');
      }
    } },
  ];

  if (isAdmin) {
    items.push(
      { label: 'משתמשים', icon: 'pi pi-users', command: () => navigate('/admin/users') },
      // { label: 'הודעות', icon: 'pi pi-envelope', command: () => navigate('/admin/messages') },
      // { label: 'תשובות קבועות', icon: 'pi pi-envelope', command: () => navigate('/admin/replies') }
    );
  }

 items.push(
  isLoggedIn
    ? {
        label: 'התנתקות',
        icon: 'pi pi-sign-out',
        command: () => {
          localStorage.clear();
          dispatch(removeToken());
          navigate('/');
        }
      }
    : {
        label: 'התחברות',
        icon: 'pi pi-sign-in',
        command: () => navigate('/')
      }
);


  const start = <img alt="logo" src="http://localhost:2200/logo2.png" height="40" className="mr-2" />;

  return <Menubar className='menubar' model={items} start={start} />;
}
