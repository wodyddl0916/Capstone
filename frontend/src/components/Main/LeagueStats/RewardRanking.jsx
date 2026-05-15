import React, { useState, useEffect } from 'react';

const RewardRanking = () => {
  const primaryBlue = '#1f4e79';
  const borderColor = '#dee2e6';

  // 1. 나의 리워드 정보 상태
  const [myReward, setMyReward] = useState({
    points: 0,
    status: '로딩중...'
  });

  // 2. 전체 리워드 랭킹 리스트 상태
  const [rankingList, setRankingList] = useState([]);

  // 3. 백엔드 데이터 호출
  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const mockMyReward = { points: 25000, status: '정상' };
        const mockRankingList = [
          { rank: 1, name: 'Mate_1**', points: 100000, type: '저압' },
          { rank: 2, name: 'Mate_2**', points: 50000, type: '저압' },
          { rank: 3, name: 'Mate_3**', points: 33333, type: '저압' },
          { rank: 4, name: 'Mate_4**', points: 25000, type: '저압' },
          { rank: 5, name: 'Mate_5**', points: 20000, type: '저압' },
        ];

        setMyReward(mockMyReward);
        setRankingList(mockRankingList);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
      }
    };

    fetchRankingData();
  }, []);

  return (
    <div style={{ padding: '30px', backgroundColor: 'white', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>리워드 랭킹</h2>
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
        <strong style={{ color: '#1f4e79' }}>리워드 랭킹</strong>
      </div>

      <div style={{ border: `2px solid ${primaryBlue}`, borderRadius: '8px', padding: '20px 40px', backgroundColor: '#f8f9fa', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '120px', fontWeight: 'bold', textAlign: 'center' }}>보유 리워드</span>
          <div style={{ flex: 1, backgroundColor: '#e9ecef', padding: '8px 15px', borderRadius: '4px', border: '1px solid #ced4da', color: '#d9534f', fontWeight: 'bold' }}>
            {myReward.points.toLocaleString()} W
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '120px', fontWeight: 'bold', textAlign: 'center' }}>포인트상태</span>
          <div style={{ flex: 1, backgroundColor: '#e9ecef', padding: '8px 15px', borderRadius: '4px', border: '1px solid #ced4da' }}>
            {myReward.status}
          </div>
        </div>
      </div>

      <div style={{ borderTop: `2px solid ${primaryBlue}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}` }}>랭킹</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}` }}>고객명</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}` }}>누적 리워드</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}` }}>저고압구분</th>
            </tr>
          </thead>
          <tbody>
            {rankingList.map((item, idx) => (
              <tr key={idx}>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}`, backgroundColor: '#f8f9fa' }}>{item.rank}</td>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}` }}>{item.name}</td>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}`, backgroundColor: '#f8f9fa' }}>{item.points.toLocaleString()} W</td>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}` }}>{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RewardRanking;