import React from 'react';
import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import Login from './pages/Login.jsx';
import Main from './pages/Main.jsx';
import SignUp from './pages/SignUp.jsx';
import SignUpForm from './pages/SignUpForm.jsx';

function AppRoutes() {
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    navigate(`/${page}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />

        <Route
          path="/signupform"
          element={<SignUpForm onNavigate={handleNavigate} />}
        />

        <Route
          path="/signup"
          element={<SignUp onNavigate={handleNavigate} />}
        />

        <Route
          path="/login"
          element={<Login onNavigate={handleNavigate} />}
        />

        <Route
          path="/main"
          element={<Main onNavigate={handleNavigate} />}
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}