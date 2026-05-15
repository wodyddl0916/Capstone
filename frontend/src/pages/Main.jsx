import React, { useState } from 'react';
import Home from "../components/Main/Home";
import ElectricStats from '../components/Main/ElectricStats';
import DataUpload from "../components/Main/MyPage/DataUpload";
import GoalSetting from "../components/Main/MyPage/GoalSetting";
import UserInfo from "../components/Main/MyPage/UserInfo";

import RegionalLeague from "../components/Main/LeagueStats/RegionalLeague";
import SavingRank from "../components/Main/LeagueStats/SavingRank";
import RewardRanking from "../components/Main/LeagueStats/RewardRanking";

import "../css/Main.css";

const Main = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState('HOME');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const topMenus = ['HOME', '전기사용량', '리그통계', '마이페이지'];

  const subMenus = [
    { title: 'HOME', items: ['HOME'] },
    { title: '전기사용량', items: ['시간대별', '일별', '월별', '연도별'] },
    { title: '리그통계', items: ['지역 리그', '절약 순위', '리워드 랭킹'] },
    { title: '마이페이지', items: ['회원정보', '목표 설정', '전력 데이터 업로드'] }
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'HOME': return <Home />;
      case '전기사용량': case '시간대별': case '일별': case '월별': case '연도별':
        return <ElectricStats />;
      case '리그통계': case '지역 리그': return <RegionalLeague />;
      case '절약 순위': return <SavingRank />;
      case '리워드 랭킹': return <RewardRanking />;
      case '마이페이지': case '회원정보': return <UserInfo />;
      case '목표 설정': return <GoalSetting />;
      case '전력 데이터 업로드': return <DataUpload />;
      default: return <Home />;
    }
  };

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="nav-logo" onClick={() => setActiveMenu('HOME')} style={{cursor: 'pointer'}}>
          <img src="favicon.svg" alt="logo" />
          <span>와트메이트</span>
        </div>
        
        <div 
          className="nav-menu-container"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div className="nav-menu">
            {topMenus.map((menu) => {
              // 메인 메뉴 활성화 조건
              const isMainActive = activeMenu === menu || 
                (menu === '전기사용량' && ['시간대별', '일별', '월별', '연도별'].includes(activeMenu)) ||
                (menu === '리그통계' && ['지역 리그', '절약 순위', '리워드 랭킹'].includes(activeMenu)) ||
                (menu === '마이페이지' && ['회원정보', '목표 설정', '전력 데이터 업로드'].includes(activeMenu));

              return (
                <div 
                  key={menu}
                  className={`menu-item ${isMainActive ? 'active' : ''}`}
                  onClick={() => setActiveMenu(menu)}
                >
                  {menu}
                </div>
              );
            })}
          </div>

          {/* 드롭다운 영역 */}
          <div className={`mega-dropdown ${isDropdownOpen ? 'show' : ''}`}>
            <div className="dropdown-container">
              {subMenus.map((menu, index) => {
                // 해당 섹션(열)이 활성화되었는지 확인
                const isSectionActive = activeMenu === menu.title || menu.items.includes(activeMenu);

                return (
                  <div key={index} className={`dropdown-section ${isSectionActive ? 'active-column' : ''}`}>
                    <h4 onClick={() => {
                      setActiveMenu(menu.title);
                      setIsDropdownOpen(false);
                    }}>
                      {menu.title}
                    </h4>
                    <ul>
                      {menu.items.map((item, idx) => (
                        <li 
                          key={idx} 
                          className={activeMenu === item ? 'active-text' : ''}
                          onClick={() => {
                            setActiveMenu(item);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="nav-utils">
          <button className="logout-btn" onClick={() => onNavigate('login')}>LOGOUT</button>
        </div>
      </nav>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Main;