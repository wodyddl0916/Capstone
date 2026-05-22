import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const MonthlyStats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("2026");

  const fetchData = async () => {
    // 🌟 [수정] 가짜 백업 ID(|| 1) 삭제
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("⚠️ 인증 세션(userId)을 탐색할 수 없습니다.");
      setData([]);
      return;
    }

    setLoading(true);
    try {
      // 🌟 [통신 경로 안정화] AWS 직격 주소 적용
      const response = await axios.get(`http://43.201.202.195:8080/api/power/monthly`, { 
        params: { userId: parseInt(userId, 10), year: parseInt(year) } 
      });
      
      console.log("📊 [디버깅] 백엔드 수신 월별 원본 데이터 규격:", response.data);

      const formatted = Array.from({ length: 12 }, (_, i) => {
        const monthNum = i + 1;
        const found = response.data.find(d => d.month === monthNum);
        const val = found ? parseFloat(parseFloat(found.usage).toFixed(2)) : 0;

        const isFutureMonth = year === "2026" && monthNum >= 5;

        return {
          name: monthNum + "월",
          real: !isFutureMonth && val > 0 ? val : null, 
          pred: isFutureMonth && val > 0 ? val : null,  
        };
      });
      
      setData(formatted);
    } catch (e) { 
      console.error("월별 데이터 로드 실패:", e);
      setData([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, [year]); 

  const realValues = data.map(d => d.real).filter(v => v !== null);
  const maxRealUsage = realValues.length > 0 ? Math.max(...realValues) : 0;

  return (
    <div className="electric-page" style={{ padding: '20px', background: '#f4f7fb' }}>
      <style>{`
        .electric-page { width: 100%; background: #f4f7fb; padding: 40px 0; font-family: 'Malgun Gothic', sans-serif; }
        .container { width: 90%; margin: 0 auto; background: #fff; padding: 30px; border: 1px solid #d9dee7; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-radius: 8px; }
        .filter-bar { background: #f8f9fa; padding: 15px; border: 1px solid #e9ecef; display: flex; align-items: center; gap: 20px; margin-bottom: 25px; border-radius: 5px; justify-content: center; }
        .chart-section { height: 480px; background: #fff; padding: 25px; border: 1px solid #d9dee7; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius: 8px; }
        .search-btn { background: #0b4c91; color: white; border: none; padding: 8px 25px; cursor: pointer; font-weight: bold; border-radius: 4px; font-size: 14px; }
        select { padding: 6px 12px; border: 1px solid #ccd0d5; border-radius: 4px; font-size: 14px; background: #fff; }
      `}</style>

      <div className="container">
        <div className="electric-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#1a202c', fontSize: '28px', fontWeight: 'bold' }}>월별 사용량 통계 및 AI 장기 예측</h1>
        </div>

        <div className="filter-bar">
          <strong>📅 조회 연도 선택 :</strong>
          <select value={year} onChange={e => setYear(e.target.value)}>
            <option value="2024">2024년</option>
            <option value="2025">2025년</option>
            <option value="2026">2026년</option>
          </select>
          <button className="search-btn" onClick={fetchData}>조회</button>
        </div>

        <div className="chart-section" style={{ display: 'block', minHeight: '400px', width: '100%' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontWeight: 'bold', color: '#0b4c91' }}>
              🔄 WattMate AI 가 월간 전력 분석 레포트를 동적 빌드 중입니다...
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#333' }} height={40} />
                <YAxis unit=" kWh" tick={{ fontSize: 12, fill: '#333' }} axisLine={false} tickLine={false} />
                
                <Tooltip formatter={(value, name) => [`${value} kWh`, name]} contentStyle={{ borderRadius: '8px', border: '1px solid #ccc' }} />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '25px', fontSize: '13px' }} />

                <Bar dataKey="real" name="월별 실측 총량" barSize={30} radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.real === maxRealUsage && maxRealUsage > 0 ? '#e02b20' : '#4bc0c0'} />
                  ))}
                </Bar>

                <Bar dataKey="pred" name="[AI 예측] 월간 예상 총량" barSize={30} radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={index} fill="#7f8c8d" /> 
                  ))}
                </Bar>

                <Line 
                  type="monotone" 
                  dataKey="pred" 
                  name="[AI 예측] 소비 장기 궤적" 
                  stroke="#ff9f40" 
                  strokeWidth={3.5} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#ff9f40' }} 
                  activeDot={{ r: 7 }}
                  connectNulls={true} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>
              조회 데이터 공백: 전력 사용량 데이터가 존재하지 않습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyStats;