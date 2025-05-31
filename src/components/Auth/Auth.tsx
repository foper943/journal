import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import './__button/__button.css';
import './__error/__error.css';
import './__form/__form.css';
import './__title/__title.css';

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
    <div className="auth">
      <h1 className="auth__title">Авторизация</h1>
      <form onSubmit={handleSubmit} className="auth__form">
        <div className="auth__form-group">
          <label className="auth__form-label">Логин:</label>
          <input
            className="auth__form-input"
            value={credentials.login}
            onChange={(e) => setCredentials({ ...credentials, login: e.target.value })}
            placeholder="Введите логин"
          />
        </div>
        <div className="auth__form-group">
          <label className="auth__form-label">Пароль:</label>
          <input
            className="auth__form-input"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder="Введите пароль"
          />
        </div>
        {error && <div className="auth__error">{error}</div>}
        <button type="submit" className="auth__button">Войти</button>
      </form>
    </div>
  );
};
