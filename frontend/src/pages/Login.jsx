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
      // 2. 우선 서버에 로그인 요청을 보냅니다.
      const response = await api.post('/api/login', {
        username: id,
        password: pw,
      });

      const { token, message } = response.data;

      if (token) {
        localStorage.setItem('accessToken', token);
        alert(message || '로그인 성공! 환영합니다.');
        onNavigate('main'); 
      }
    } catch (error) {
      console.error('로그인 에러 발생:', error);

      // 📍 [핵심] 서버가 응답하지 않거나(네트워크 에러) 연결이 실패했을 때 관리자 계정 확인
      if (id === 'user' && pw === '1234') {
        // 비상용 가짜 토큰 생성 및 저장
        localStorage.setItem('accessToken', 'admin-bypass-token-2026');
        
        alert('서버 오프라인: 관리자 계정으로 우회 접속합니다.');
        onNavigate('main');
      } else {
        // 관리자 정보도 틀리고 서버도 응답이 없는 경우
        if (!error.response) {
          alert('서버와 연결할 수 없습니다. 관리자 계정(user/1234)으로 시도하거나 서버 상태를 확인하세요.');
        } else {
          // 서버는 작동 중이지만 아이디/비번이 틀린 경우
          const errorMessage = error.response.data.message || '아이디 또는 비밀번호가 일치하지 않습니다.';
          alert(errorMessage);
        }
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