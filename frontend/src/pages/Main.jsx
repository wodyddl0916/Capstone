import React, { useState } from 'react';
import Home from "../components/Main/Home";

import ElectricStats from '../components/Main/ElectricStats';
import HourlyStats from '../components/Main/ElectricStats/HourlyStats';
import DailyStats from '../components/Main/ElectricStats/DailyStats';
import MonthlyStats from '../components/Main/ElectricStats/MonthlyStats';

import DataUpload from "../components/Main/MyPage/DataUpload";
import GoalSetting from "../components/Main/MyPage/GoalSetting";
import UserInfo from "../components/Main/MyPage/UserInfo";

import RegionalLeague from "../components/Main/LeagueStats/RegionalLeague";
import ElectricBillPage from "../components/Main/ElectricBillPage";

// 포인트 상점 컴포넌트 임포트
import PointStore from "../components/Main/PointStore/PointStore";

import "../css/Main.css";

const Main = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState('HOME');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 🌟 [순서 고정] 상단 클릭 메뉴 순서: 마이페이지를 맨 끝(오른쪽)으로!
  const topMenus = ['HOME', '전기사용량', '전기요금', '리그통계', '포인트상점', '마이페이지'];

  // 🌟 [순서 고정] 하단 드롭다운 섹션 순서: 상단과 1:1로 정확하게 매칭!
  const subMenus = [
    { title: 'HOME', items: [''] },
    { title: '전기사용량', items: ['시간대별', '일별', '월별'] },
    { title: '전기요금', items: ['전기요금표', '이번달 전기요금 예측'] },
    { title: '리그통계', items: ['지역 리그 순위',] },
    { title: '포인트상점', items: ['상품 구매'] },
    { title: '마이페이지', items: ['회원정보', '목표 설정', '전력 데이터 업로드'] }
  ];

  // 메뉴에 맞게 개별 컴포넌트 렌더링
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

  // 메뉴 클릭 시 특정 메뉴로 리다이렉트하는 핸들러
  const handleMenuClick = (menuName) => {
    if (menuName === '전기사용량') {
      setActiveMenu('시간대별');
    } else if (menuName === '전기요금') {
      setActiveMenu('전기요금표');
    } else if (menuName === '포인트상점') {
      setActiveMenu('상품 구매');
    } else if (menuName === '마이페이지') {
      setActiveMenu('회원정보'); // 마이페이지 클릭 시 회원정보 탭을 기본값으로 세팅
    } else {
      setActiveMenu(menuName);
    }
  };

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="nav-logo" onClick={() => setActiveMenu('HOME')} style={{cursor: 'pointer'}}>
          <img src="/favicon.svg" alt="logo" />
          <span>와트메이트</span>
        </div>
        
        {/* 메뉴와 드롭다운을 묶어주는 메인 컨테이너 */}
        <div 
          className="nav-menu-container"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
        >
          {/* 🌟 [배너 정렬] 상단 내비게이션 바 배너 메뉴 렌더링 */}
          <div className="nav-menu" style={{ display: 'flex', gap: '20px' }}>
            {topMenus.map((menu) => {
              const isMainActive = activeMenu === menu || 
                (menu === '전기사용량' && ['시간대별', '일별', '월별'].includes(activeMenu)) ||
                (menu === '전기요금' && ['전기요금표', '이번달 전기요금 예측'].includes(activeMenu)) ||
                (menu === '리그통계' && ['지역 리그', '절약 순위', '리워드 랭킹'].includes(activeMenu)) ||
                (menu === '포인트상점' && ['상품 구매'].includes(activeMenu)) ||
                (menu === '마이페이지' && ['회원정보', '목표 설정', '전력 데이터 업로드'].includes(activeMenu));

              return (
                <div 
                  key={menu}
                  className={`menu-item ${isMainActive ? 'active' : ''}`}
                  onClick={() => handleMenuClick(menu)}
                  style={{ cursor: 'pointer', padding: '10px 15px', fontWeight: 'bold' }}
                >
                  {menu}
                </div>
              );
            })}
          </div>

          {/* 🌟 [드롭다운 정렬] 상단 메뉴와 열 크기를 완벽하게 6칸으로 쪼갠 메가 드롭다운 */}
          <div className={`mega-dropdown ${isDropdownOpen ? 'show' : ''}`} style={{ width: '100%' }}>
            <div className="dropdown-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', width: '100%' }}>
              {subMenus.map((menu, index) => {
                const isSectionActive = activeMenu === menu.title || menu.items.includes(activeMenu);

                return (
                  <div key={index} className={`dropdown-section ${isSectionActive ? 'active-column' : ''}`} style={{ textAlign: 'center' }}>
                    <h4 style={{ cursor: 'pointer', margin: '10px 0', fontSize: '15px', fontWeight: 'bold' }} onClick={() => {
                      handleMenuClick(menu.title);
                      setIsDropdownOpen(false);
                    }}>
                      {menu.title}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {menu.items.map((item, idx) => (
                        <li 
                          key={idx} 
                          className={activeMenu === item ? 'active-text' : ''}
                          style={{ padding: '5px 0', cursor: 'pointer', fontSize: '13px' }}
                          onClick={() => {
                            handleMenuClick(item);
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
