import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

interface AuthProps {
  onLogin: (isAuth: boolean) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.login === 'admin' && credentials.password === '123') {
      localStorage.setItem('isAuth', 'true');
      onLogin(true);
      navigate('/students');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Авторизация</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Логин:</label>
          <input
            value={credentials.login}
            onChange={(e) => setCredentials({...credentials, login: e.target.value})}
            placeholder="Введите логин"
          />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            placeholder="Введите пароль"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="auth-button">Войти</button>
      </form>
    </div>
  );
};