import React, { useState, useEffect } from 'react';

const SavingRank = () => {
  const primaryBlue = '#1f4e79';
  const borderColor = '#dee2e6';

  // 1. 나의 절약 정보 상태
  const [mySaving, setMySaving] = useState({
    nickname: '로딩중...',
    amount: 0
  });

  // 2. 절약 순위 리스트 상태
  const [savingList, setSavingList] = useState([]);

  // 3. 백엔드 데이터 호출
  useEffect(() => {
    const fetchSavingData = async () => {
      try {
        const mockMySaving = { nickname: 'ECO_Mate***', amount: 150 };
        const mockSavingList = [
          { rank: '01', name: 'User_1***', amount: 480, date: '08' },
          { rank: '02', name: 'User_2***', amount: 460, date: '08' },
          { rank: '03', name: 'User_3***', amount: 440, date: '08' },
        ];

        setMySaving(mockMySaving);
        setSavingList(mockSavingList);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
      }
    };

    fetchSavingData();
  }, []);

  return (
    <div style={{ padding: '30px', backgroundColor: 'white', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>절약 순위</h2>
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
        <strong style={{ color: '#1f4e79' }}>절약 순위</strong>
      </div>

      <div style={{ border: `2px solid ${primaryBlue}`, borderRadius: '8px', padding: '20px 40px', backgroundColor: '#f8f9fa', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '120px', fontWeight: 'bold', textAlign: 'center' }}>나의 닉네임</span>
          <div style={{ flex: 1, backgroundColor: '#e9ecef', padding: '8px 15px', borderRadius: '4px', border: '1px solid #ced4da' }}>
            {mySaving.nickname}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '120px', fontWeight: 'bold', textAlign: 'center' }}>절약량</span>
          <div style={{ flex: 1, backgroundColor: '#e9ecef', padding: '8px 15px', borderRadius: '4px', border: '1px solid #ced4da', fontWeight: 'bold' }}>
            {mySaving.amount}kWh
          </div>
        </div>
      </div>

      <div style={{ borderTop: `2px solid ${primaryBlue}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
          <caption style={{ textAlign: 'left', padding: '10px 0', fontWeight: 'bold' }}>현행 절약 우수자 정보</caption>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}` }}>순위</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}` }}>성명(닉네임)</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}` }}>절약수치</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}` }}>검침일</th>
            </tr>
          </thead>
          <tbody>
            {savingList.map((item, idx) => (
              <tr key={idx}>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}`, backgroundColor: '#f8f9fa' }}>{item.rank}</td>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}` }}>{item.name}</td>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}`, backgroundColor: '#f8f9fa' }}>{item.amount}kWh</td>
                <td style={{ padding: '12px', border: `1px solid ${borderColor}` }}>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SavingRank;