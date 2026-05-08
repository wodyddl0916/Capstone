import React, { useState } from 'react';
import '../css/Login.css';

// 🌟 현재 로컬에서 백엔드 테스트 중이므로 주소를 변경합니다.
const API_BASE = "http://43.201.202.195:8080";

const Login = ({ onNavigate }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!id || !pw) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,          // 🌟 백엔드 DTO에 맞춰서 username 대신 id로 보냅니다.
          password: pw,
        }),
      });

      const data = await response.json();

      // 2. 결과 처리
      if (response.ok) {
        // 🌟 핵심: 백엔드에서 받은 두 개의 토큰을 브라우저 저장소에 보관합니다.
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        alert(`로그인 성공! 환영합니다.`);
        onNavigate('main'); // 로그인 성공 시 메인 화면으로 이동
      } else {
        alert(data.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      alert('서버와 연결할 수 없습니다. 백엔드 서버가 켜져 있는지 확인하세요.');
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
          <input
            type="password"
            className="input-field"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()} 
            disabled={isLoading}
          />
          <button 
            onClick={handleLogin} 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '와트메이트 로그인'}
          </button>
        </div>

        <div className="login-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
          계정이 없으신가요? 
          <button 
            onClick={() => onNavigate('signup')} 
            style={{ marginLeft: '8px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
