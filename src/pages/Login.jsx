import React, { useState } from 'react';
import '../css/Login.css';

const Login = ({ onNavigate }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleLogin = async () => {
    if (id === 'user' && pw === '1234') {
      alert('관리자님 환영합니다!');
      onNavigate('main');
    } else {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          password: pw,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('로그인 성공!');

        // 백엔드에서 JWT 토큰을 보내주는 경우 저장
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        onNavigate('main');
      } else {
        alert(data.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      alert('서버 연결에 실패했습니다.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="header-section">
          <div className="subtitle">에너지가 가치가 되는 순간</div>
          <div className="title-wrapper">
            <img src="favicon.svg" className="logo-icon" alt="와트메이트 로고" />
            <h1 className="main-title">와트메이트</h1>
          </div>
        </div>

        <div className="form-section">
          <input
            type="text"
            className="input-field"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <input
            type="password"
            className="input-field"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />

          <button onClick={handleLogin} className="login-button">
            와트메이트 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;