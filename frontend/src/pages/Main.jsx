import React, { useState } from 'react';
import Home from "../components/Main/Home";
import ElectricStats from '../components/Main/ElectricStats';
import DataUpload from "../components/Main/MyPage/DataUpload";
import GoalSetting from "../components/Main/MyPage/GoalSetting";
import UserInfo from "../components/Main/MyPage/UserInfo";

// 새롭게 만든 3개의 컴포넌트 import
import RegionalLeague from "../components/Main/LeagueStats/RegionalLeague";
import SavingRank from "../components/Main/LeagueStats/SavingRank";
import RewardRanking from "../components/Main/LeagueStats/RewardRanking";

import "../css/Main.css";

const Main = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState('HOME');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 상단 헤더 메뉴 이름
  const topMenus = ['HOME', '전기사용량', '리그통계', '마이페이지'];

  // 서브 메뉴 데이터
  const subMenus = [
    { title: 'HOME', items: [''] },
    { title: '전기사용량', items: ['시간대별', '일별', '월별', '연도별'] },
    { title: '리그통계', items: ['지역 리그', '절약 순위', '리워드 랭킹'] },
    { title: '마이페이지', items: ['회원정보', '목표 설정', '전력 데이터 업로드'] }
  ];

  // 클릭된 메뉴(activeMenu)에 따라 화면을 결정하는 핵심 함수
  const renderContent = () => {
    switch (activeMenu) {
      case 'HOME': 
        return <Home />;
      
      // 전기사용량 섹션
      case '전기사용량': 
      case '시간대별': case '일별': case '월별': case '연도별':
        return <ElectricStats />; 
      
      // 리그통계 섹션 (각각 독립된 창으로 렌더링)
      case '리그통계': 
      case '지역 리그': 
        return <RegionalLeague />;
      case '절약 순위': 
        return <SavingRank />;
      case '리워드 랭킹': 
        return <RewardRanking />;
      
      // 마이페이지 섹션
      case '마이페이지': 
      case '회원정보': 
        return <UserInfo />;
      case '목표 설정': 
        return <GoalSetting />;
      case '전력 데이터 업로드': 
        return <DataUpload />;
      
      default: 
        return <Home />;
    }
  };

  return (
    <div className="main-layout bg-[#0F172A]">
      {/* --- GNB 네비게이션 --- */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => setActiveMenu('HOME')} style={{cursor: 'pointer'}}>
          <img src="favicon.svg" alt="logo" />
          <span className="text-[#00FF88] font-bold">와트메이트</span>
        </div>
        
        <div 
          className="nav-menu-container"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div className="nav-menu">
            {topMenus.map((menu) => (
              <div 
                key={menu}
                className={`menu-item ${
                  activeMenu === menu || 
                  (menu === '리그통계' && ['지역 리그', '절약 순위', '리워드 랭킹'].includes(activeMenu)) ||
                  (menu === '마이페이지' && ['회원정보', '목표 설정', '전력 데이터 업로드'].includes(activeMenu))
                    ? 'active' : ''
                }`}
                onClick={() => setActiveMenu(menu)}
              >
                {menu}
              </div>
            ))}
          </div>

          {/* --- 드롭다운 서브메뉴 영역 --- */}
          <div className={`mega-dropdown ${isDropdownOpen ? 'show' : ''}`}>
            <div className="dropdown-container">
              {subMenus.map((menu, index) => (
                <div key={index} className="dropdown-section">
                  <h4 onClick={() => {
                    setActiveMenu(menu.title);
                    setIsDropdownOpen(false);
                  }} style={{cursor: 'pointer'}}>
                    {menu.title}
                  </h4>
                  <ul>
                    {menu.items.map((item, idx) => (
                      item !== '' && (
                        <li 
                          key={idx} 
                          className={activeMenu === item ? 'active-sub' : ''}
                          onClick={() => {
                            setActiveMenu(item); // 여기서 메뉴를 클릭하면 화면이 바뀜
                            setIsDropdownOpen(false);
                          }}
                        >
                          {item}
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="nav-utils">
          <button className="logout-btn" onClick={() => onNavigate('login')}>LOGOUT</button>
        </div>
      </nav>

      {/* --- 컴포넌트 렌더링 영역 --- */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Main;