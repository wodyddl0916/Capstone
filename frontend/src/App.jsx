import React, { useState } from 'react'; // { useState } 를 추가!
import './App.css';
import Login from './components/Login.jsx';
import Main from './components/Main.jsx';
import MyPage from './components/MyPage.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // 페이지 이동 시 맨 위로 스크롤
  };

  return (
    <div className="app-container">
      {/* 상태(currentPage)에 따라 다른 컴포넌트를 보여줍니다 */}
      {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
      {currentPage === 'main' && <Main onNavigate={handleNavigate} />}
      {currentPage === 'mypage' && <MyPage onNavigate={handleNavigate} />}
    </div>
  );
}
