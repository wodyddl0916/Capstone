import React, { useState } from 'react';
import Home from "../components/Main/Home";
import ElectricStats from '../components/Main/ElectricStats';
import HourlyStats from '../components/Main/ElectricStats/HourlyStats';
import DailyStats from '../components/Main/ElectricStats/DailyStats';
import MonthlyStats from '../components/Main/ElectricStats/MonthlyStats';
import DataUpload from "../components/Main/MyPage/DataUpload";
//import GoalSetting from "../components/Main/MyPage/GoalSetting";
import UserInfo from "../components/Main/MyPage/UserInfo";
import RegionalLeague from "../components/Main/LeagueStats/RegionalLeague";
import ElectricBillPage from "../components/Main/ElectricBillPage";
import PointStore from "../components/Main/PointStore/PointStore";
import "../css/Main.css";

const Main = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState('HOME');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const topMenus = ['HOME', '전기사용량', '전기요금', '리그통계', '포인트상점', '마이페이지'];

  const subMenus = [
    { title: 'HOME', items: [''] },
    { title: '전기사용량', items: ['시간대별', '일별', '월별'] },
    { title: '전기요금', items: ['전기요금표', '이번달 전기요금 예측'] },
    { title: '리그통계', items: ['지역 리그 순위'] },
    { title: '포인트상점', items: ['상품 구매'] },
    { title: '마이페이지', items: ['회원정보', '전력 데이터 업로드'] }
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'HOME': return <Home />;
      case '전기사용량': 
      case '시간대별': return <HourlyStats />;
      case '일별': return <DailyStats />;
      case '월별': return <MonthlyStats />;
      case '전기요금':
      case '전기요금표': return <ElectricBillPage view="tariff" />;
      case '이번달 전기요금 예측': return <ElectricBillPage view="estimate" />;
      case '리그통계': case '지역 리그 순위': return <RegionalLeague />;
      case '포인트상점':
      case '상품 구매': return <PointStore />;
      case '마이페이지': case '회원정보': return <UserInfo />;
      case '목표 설정': return <GoalSetting />;
      case '전력 데이터 업로드': return <DataUpload />;
      default: return <Home />;
    }
  };

  const handleMenuClick = (menuName) => {
    if (menuName === '전기사용량') setActiveMenu('시간대별');
    else if (menuName === '전기요금') setActiveMenu('전기요금표');
    else if (menuName === '포인트상점') setActiveMenu('상품 구매');
    else if (menuName === '마이페이지') setActiveMenu('회원정보');
    else setActiveMenu(menuName);
  };

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="nav-logo" onClick={() => setActiveMenu('HOME')} style={{cursor: 'pointer'}}>
          <img src="/favicon.svg" alt="logo" />
          <span>와트메이트</span>
        </div>
        
        {/* 메뉴와 드롭다운을 감싸는 전체 영역에 이벤트를 걸어 끊김 현상 방지 */}
        <div 
          className="nav-menu-container"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {/* 상단 GNB 배너 메뉴 */}
          <div className="nav-menu">
            {topMenus.map((menu) => {
              const isMainActive = activeMenu === menu || 
                (menu === '전기사용량' && ['시간대별', '일별', '월별'].includes(activeMenu)) ||
                (menu === '전기요금' && ['전기요금표', '이번달 전기요금 예측'].includes(activeMenu)) ||
                (menu === '리그통계' && ['지역 리그 순위', '지역 리그', '절약 순위', '리워드 랭킹'].includes(activeMenu)) ||
                (menu === '포인트상점' && ['상품 구매'].includes(activeMenu)) ||
                (menu === '마이페이지' && ['회원정보', '목표 설정', '전력 데이터 업로드'].includes(activeMenu));

              return (
                <div 
                  key={menu}
                  className={`menu-item ${isMainActive ? 'active' : ''}`}
                  onClick={() => handleMenuClick(menu)}
                >
                  {menu}
                </div>
              );
            })}
          </div>

          {/* 짜르르 내려오는 메가 드롭다운 박스 */}
          <div className={`mega-dropdown ${isDropdownOpen ? 'show' : ''}`}>
            <div className="dropdown-container">
              {subMenus.map((menu, index) => {
                const isSectionActive = activeMenu === menu.title || menu.items.includes(activeMenu);

                return (
                  <div key={index} className={`dropdown-section ${isSectionActive ? 'active-column' : ''}`}>
                    <h4 onClick={() => {
                      handleMenuClick(menu.title);
                      setIsDropdownOpen(false);
                    }}>
                      {menu.title}
                    </h4>
                    <ul>
                      {menu.items.map((item, idx) => (
                        item && (
                          <li 
                            key={idx} 
                            className={activeMenu === item ? 'active-text' : ''}
                            onClick={() => {
                              handleMenuClick(item);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {item}
                          </li>
                        )
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