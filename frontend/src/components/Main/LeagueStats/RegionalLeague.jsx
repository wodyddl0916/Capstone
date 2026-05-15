import React, { useState, useEffect } from 'react';

const RegionalLeague = () => {
  const primaryBlue = '#1f4e79';
  const lightGray = '#f8f9fa';
  const borderColor = '#dee2e6';

  // 1. 나의 지역 정보 상태
  const [myRegionInfo, setMyRegionInfo] = useState({
    region: '로딩중...',
    rank: '로딩중...'
  });

  // 2. 지역 리그 리스트 상태
  const [leagueList, setLeagueList] = useState([]);

  // 3. 백엔드 데이터 호출
  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        // 실제 API 호출 (예: const response = await fetch('/api/league/region'); )
        // 아래는 백엔드에서 받아온 가상의 데이터
        const mockMyInfo = { region: '광주광역시 광산구', rank: '전국 3위' };
        const mockLeagueList = [
          { name: '광주광역시 북구', rate: '94.2%', users: '1,240', type: '저압' },
          { name: '광주광역시 동구', rate: '88.5%', users: '3,500', type: '저압' },
          { name: '광주광역시 광산구', rate: '91.0%', users: '2,100', type: '저압' },
        ];

        setMyRegionInfo(mockMyInfo);
        setLeagueList(mockLeagueList);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
      }
    };

    fetchLeagueData();
  }, []);

  return (
    <div style={{ padding: '30px', backgroundColor: 'white', minHeight: '100vh', color: '#333', fontFamily: 'Malgun Gothic, dotum, sans-serif' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#222', marginBottom: '10px' }}>지역 리그</h2>
      <div style={{ 
        fontSize: '13px', 
        color: '#666', 
        marginBottom: '20px', 
        borderBottom: '1px solid #eee', 
        paddingBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
        }}>
        <span>🏠 리그통계</span>
        <span style={{ margin: '0 5px', color: '#ccc' }}>&gt;</span>
        <strong style={{ color: '#1f4e79' }}>지역 리그</strong>
      </div>
      
      {/* --- 상단 요약 박스 (State 연결) --- */}
      <div style={{ 
        border: `2px solid ${primaryBlue}`, 
        borderRadius: '8px', 
        padding: '20px 40px', 
        backgroundColor: lightGray,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '120px', fontWeight: 'bold', textAlign: 'center' }}>우리 동네</span>
          <div style={{ flex: 1, backgroundColor: '#e9ecef', padding: '8px 15px', borderRadius: '4px', border: '1px solid #ced4da' }}>
            {myRegionInfo.region}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '120px', fontWeight: 'bold', textAlign: 'center' }}>현재 순위</span>
          <div style={{ flex: 1, backgroundColor: '#e9ecef', padding: '8px 15px', borderRadius: '4px', border: '1px solid #ced4da', color: '#0056b3', fontWeight: 'bold' }}>
            {myRegionInfo.rank}
          </div>
        </div>
      </div>

      {/* --- 하단 리스트 테이블 (State Map 연결) --- */}
      <div style={{ borderTop: `2px solid ${primaryBlue}`, marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: lightGray }}>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}`, width: '25%' }}>지역명</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}`, width: '25%' }}>절약률</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}`, width: '25%' }}>참여가구</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}`, width: '25%' }}>저고압구분</th>
            </tr>
          </thead>
          <tbody>
            {leagueList.map((item, idx) => (
              <tr key={idx} style={{ textAlign: 'center' }}>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}`, backgroundColor: lightGray, fontWeight: 'bold' }}>{item.name}</td>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}` }}>{item.rate}</td>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}`, backgroundColor: lightGray }}>{item.users}</td>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}` }}>{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegionalLeague;