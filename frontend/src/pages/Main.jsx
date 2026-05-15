import React, { useState } from 'react';
import Home from "../components/Main/Home";
import LeagueStats from "../components/Main/LeagueStats";
import ElectricStats from '../components/Main/ElectricStats';
import DataUpload from "../components/Main/MyPage/DataUpload";
import GoalSetting from "../components/Main/MyPage/GoalSetting";
import UserInfo from "../components/Main/MyPage/UserInfo";
import "../css/Main.css";

const Main = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState('HOME');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 상단 헤더 메뉴 이름 (배열)
  const topMenus = ['HOME', '전기사용량', '리그통계', '마이페이지'];

  // 서브 메뉴 데이터
  const subMenus = [
    { title: 'HOME', items: ['HOME'] },
    { title: '전기사용량', items: ['시간대별', '일별', '월별', '연도별'] },
    { title: '리그통계', items: ['지역 리그', '절약 순위', '리워드 랭킹'] },
    { title: '마이페이지', items: ['회원정보', '목표 설정', '전력 데이터 업로드'] }
  ];

  // 클릭된 메뉴(activeMenu)에 따라 어떤 화면을 보여줄지 결정하는 함수
  const renderContent = () => {
    switch (activeMenu) {
      case 'HOME': return <Home />;
      case '전기사용량': return <ElectricStats />; 
      case '리그통계': return <LeagueStats />;
      // 상단에서 '마이페이지' 탭 자체를 눌렀을 때 기본으로 보여줄 화면
      case '마이페이지': return <UserInfo />; 
      
      // 마이페이지의 세부 하위 메뉴들
      case '회원정보': return <UserInfo />;
      case '목표 설정': return <GoalSetting />;
      case '전력 데이터 업로드': return <DataUpload />;
      
      default: return <Home />;
    }
  };

  return (
    <div className="main-layout">
      {/* --- GNB 네비게이션 --- */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => setActiveMenu('HOME')} style={{cursor: 'pointer'}}>
          <img src="favicon.svg" alt="logo" />
          <span>와트메이트</span>
        </div>
        
        {/* nav-menu-container에 호버 이벤트를 걸어서 메뉴 영역에서만 드롭다운 동작하게 함 */}
        <div 
          className="nav-menu-container"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div className="nav-menu">
            {topMenus.map((menu) => (
              <div 
                key={menu}
                // 메인 메뉴뿐만 아니라 하위 메뉴를 보고 있을 때도 상단 탭이 활성화되도록 처리
                className={`menu-item ${
                  activeMenu === menu || 
                  (menu === '마이페이지' && ['회원정보', '목표 설정', '전력 데이터 업로드'].includes(activeMenu)) 
                    ? 'active' 
                    : ''
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
                  {/* 헤더 부분 클릭 시 해당 메인 카테고리로 이동 */}
                  <h4 onClick={() => {
                    setActiveMenu(menu.title);
                    setIsDropdownOpen(false);
                  }} style={{cursor: 'pointer'}}>
                    {menu.title}
                  </h4>
                  <ul>
                    {menu.items.map((item, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => {
                          setActiveMenu(item); // 서브메뉴(예: 회원정보) 클릭 시 activeMenu 업데이트
                          setIsDropdownOpen(false); // 드롭다운 닫기
                        }}
                      >
                        {item}
                      </li>
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