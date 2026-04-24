import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from '../components/AuthPage';
import { useUser } from '../context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  return <AuthPage initialMode="login" onLogin={(payload) => { login(payload); navigate('/'); }} />;
}
