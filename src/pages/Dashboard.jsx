import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userName] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser).fullName : '';
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome, {userName}!</h1>
        <p style={styles.subtitle}>You have successfully logged in to the dashboard.</p>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' },
  card: { backgroundColor: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', textAlign: 'center', maxWidth: '500px', width: '100%' },
  title: { fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' },
  subtitle: { fontSize: '1.125rem', color: '#64748b', marginBottom: '2rem' },
  button: { padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#ef4444', color: 'white', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }
};

export default Dashboard;
