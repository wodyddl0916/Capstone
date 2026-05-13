import React, { useState } from 'react';
import api from '../api/axios'; // 설정된 axios 인스턴스 임포트
import '../css/Login.css';

const Login = ({ onNavigate }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // 1. 입력값 검증
    if (!id || !pw) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. 로그인 요청
      // 백엔드 LoginRequest DTO의 필드명인 'username'과 'password'에 맞춤
      const response = await api.post('/api/login', {
        username: id,
        password: pw,
      });

      // 3. 응답 데이터 처리
      // 백엔드 LoginResponse DTO의 필드명인 'token'과 'message'를 받아옴
      const { token, message } = response.data;

      if (token) {
        // 기존 axios.js 인터셉터와의 호환을 위해 'accessToken'이라는 이름으로 저장
        localStorage.setItem('accessToken', token);
        
        alert(message || '로그인 성공! 환영합니다.');
        onNavigate('main'); // 메인 화면으로 이동
      }
    } catch (error) {
      console.error('로그인 에러 상세:', error);

      if (error.response) {
        // 서버가 에러 응답을 준 경우 (401, 400 등)
        const errorMessage = error.response.data.message || '아이디 또는 비밀번호가 일치하지 않습니다.';
        alert(errorMessage);
      } else {
        // 네트워크 에러 혹은 서버가 꺼져 있는 경우
        alert('서버와 연결할 수 없습니다. AWS 서버 상태와 포트(8080) 설정을 확인하세요.');
      }
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
            placeholder="아이디(이메일주소)"
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
            style={{ 
              marginLeft: '8px', 
              background: 'none', 
              border: 'none', 
              color: '#007bff', 
              cursor: 'pointer', 
              textDecoration: 'underline' 
            }}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;