import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ElectricStats = ({ thisWeek, nextWeek }) => {
  // 데이터가 없을 경우를 대비한 안전 장치
  if (!thisWeek || !nextWeek) return <p style={{textAlign: 'center', padding: '20px'}}>데이터를 분석 중이거나 불러올 수 없습니다.</p>;

  const thisWeekData = Array.isArray(thisWeek) ? thisWeek : [thisWeek];
  const nextWeekData = Array.isArray(nextWeek) ? nextWeek : [nextWeek];

  // 데이터 변환: '이번주' -> '월평균', '다음주' -> '예측'으로 명칭 변경
  const chartData = thisWeekData.map((val, index) => {
    const avgVal = val !== undefined && val !== null ? val : 0;
    const predVal = nextWeekData[index] !== undefined && nextWeekData[index] !== null ? nextWeekData[index] : 0;

    return {
      name: `${String(index + 1).padStart(2, '0')}:00`,
      월평균: parseFloat(Number(avgVal).toFixed(2)),
      예측: parseFloat(Number(predVal).toFixed(2)),
    };
  });

  return (
    <div style={{ width: '100%', height: 450, marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>📊 월간 시간대별 전력 사용 패턴 및 예측</h3>
      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 12}} label={{ value: 'kWh', angle: -90, position: 'insideLeft', offset: 10 }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Line 
              name="최근 한 달 평균"
              type="monotone" 
              dataKey="월평균" 
              stroke="#8884d8" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6 }} 
            />
            <Line 
              name="다음 달 예측"
              type="monotone" 
              dataKey="예측" 
              stroke="#ff7300" 
              strokeWidth={3} 
              strokeDasharray="5 5" 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p style={{ marginTop: '15px', fontSize: '13px', color: '#888', textAlign: 'center' }}>
        * 실선은 최근 30일간의 시간대별 평균 사용량이며, 점선은 AI가 예측한 다음 달 사용 패턴입니다.
      </p>
    </div>
  );
};

export default ElectricStats;
