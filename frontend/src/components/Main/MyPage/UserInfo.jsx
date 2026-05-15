import React, { useState, useEffect } from 'react';

const UserInfo = () => {
  // 1. 모든 사용자 정보를 담을 상태(State) 정의
  const [userData, setUserData] = useState({
    name: '로딩중',
    role: '...',
    region: '...',
    housingType: '...',
    points: 0,
    missions: 0,
    ranking: '...',
    lastLogin: '데이터를 불러오는 중...' // 📍 최근 접속일 추가
  });

  // 2. 컴포넌트 마운트 시 백엔드 API로부터 데이터를 받아오는 로직
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 실제 연동 시: const response = await fetch('/api/user/profile');
        // 아래는 백엔드 응답을 가정한 가짜 데이터(Mock Data)입니다.
        const mockResponseData = {
          name: '홍길동',
          role: '일반 회원',
          region: '광주광역시 광산구',
          housingType: '1인 가구',
          points: 1500,
          missions: 4,
          ranking: 'B등급 (상위 30%)',
          lastLogin: '2024. 05. 20 (월) 14:32' // 📍 실제 데이터 연결
        };
        
        setUserData(mockResponseData);
      } catch (error) {
        console.error('사용자 정보를 불러오는데 실패했습니다:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="empty-page" style={{ paddingTop: '40px' }}>
      <div className="container">
        <div className="page-title" style={{ textAlign: 'left', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>
          마이페이지
        </div>

        {/* 브레드크럼 */}
        <div style={{ fontSize: '13px', color: '#666', marginBottom: '30px', display: 'flex', alignItems: 'center', textAlign: 'left' }}>
          <span>🏠 마이페이지 &gt; <strong>내 정보 관리</strong></span>
        </div>

        <div className="mypage-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '30px', textAlign: 'left' }}>
          
          {/* 왼쪽 컬럼: 프로필 요약 */}
          <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', fontSize: '20px' }}>기본 프로필</h3>
            <div className="profile-section" style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div className="profile-img-circle" style={{ width: '100px', height: '100px', background: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '50px', margin: '0 auto 15px' }}>
                👤
              </div>
              <div className="user-name" style={{ fontSize: '22px', fontWeight: 'bold' }}>{userData.name} 님</div>
              <div className="user-role" style={{ color: '#888', marginTop: '5px' }}>{userData.role}</div>
            </div>
            
            <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f9f9f9' }}>
              <span className="info-label" style={{ color: '#666' }}>거주 지역</span>
              <span className="info-value" style={{ fontWeight: '600' }}>{userData.region}</span>
            </div>
            <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f9f9f9' }}>
              <span className="info-label" style={{ color: '#666' }}>주거 형태</span>
              <span className="info-value" style={{ fontWeight: '600' }}>{userData.housingType}</span>
            </div>
            
            <button className="btn" style={{ width: '100%', marginTop: '25px', padding: '12px', background: '#B4C6B6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              프로필 수정하기
            </button>
          </div>

          {/* 오른쪽 컬럼: 활동 내역 및 보안 */}
          <div className="right-column" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* 리워드 카드 */}
            <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>리워드 및 활동 내역</h3>
              
              <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
                <span className="info-label" style={{ color: '#666' }}>누적 와트 포인트</span>
                <span className="info-value" style={{ color: '#4CAF50', fontSize: '32px', fontWeight: 'bold' }}>
                  {userData.points.toLocaleString()} P
                </span>
              </div>
              
              <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '1px solid #f9f9f9' }}>
                <span className="info-label" style={{ color: '#666' }}>성공한 미션 횟수</span>
                <span className="info-value" style={{ fontWeight: '600' }}>총 {userData.missions}회</span>
              </div>
              
              <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
                <span className="info-label" style={{ color: '#666' }}>현재 랭킹 등급</span>
                <span className="info-value" style={{ color: '#FFC107', fontWeight: 'bold' }}>{userData.ranking}</span>
              </div>
            </div>

            {/* 계정 보안 카드 (최근 접속일 연동됨) */}
            <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>계정 보안</h3>
              {/* 📍 고정 텍스트를 {userData.lastLogin}으로 교체 */}
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                최근 접속: {userData.lastLogin}
              </p>
              <button className="btn btn-secondary" style={{ padding: '10px 20px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                비밀번호 변경
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;