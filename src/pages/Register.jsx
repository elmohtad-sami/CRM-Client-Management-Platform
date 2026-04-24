import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from '../components/AuthPage';
import { useUser } from '../context/UserContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useUser();

  return <AuthPage initialMode="register" onLogin={(payload) => { login(payload); navigate('/'); }} />;
}
