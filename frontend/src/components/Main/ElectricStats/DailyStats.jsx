import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';

const DailyStats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2026"); 
  const [selectedMonth, setSelectedMonth] = useState("05"); 

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') || 1;
      const response = await axios.get(`/api/power/daily`, {
        params: { userId, month: parseInt(selectedMonth), year: parseInt(selectedYear) }
      });
      
      console.log("📊 [디버깅] 백엔드 수신 원본 데이터 규격:", response.data);

      const isFutureMonth = parseInt(selectedMonth) >= 5;

      const formatted = response.data.map(item => {
        const dateParts = item.date.split('-');
        const dayLabel = `${parseInt(dateParts[2])}일`;

        let val = 0;

        // 🌟 [정밀 맵핑] 백엔드 응답 필드가 무엇이든 실제 DB 수치를 최우선으로 가로챕니다.
        if (isFutureMonth) {
          // 5월 예측달: predUsageKwh -> pred_usage_kwh -> usage 순서로 0이 아닌 유효값을 우선 탐색
          val = item.predUsageKwh !== undefined && item.predUsageKwh > 0 ? item.predUsageKwh : 
                (item.pred_usage_kwh !== undefined && item.pred_usage_kwh > 0 ? item.pred_usage_kwh : (item.usage || 0));
        } else {
          // 4월 이하 실측달: realUsageKwh -> real_usage_kwh -> usage 순서로 유효값 탐색
          val = item.realUsageKwh !== undefined && item.realUsageKwh > 0 ? item.realUsageKwh : 
                (item.real_usage_kwh !== undefined && item.real_usage_kwh > 0 ? item.real_usage_kwh : (item.usage || 0));
        }

        // 소수점 2자리까지만 정밀 포맷팅
        val = parseFloat(parseFloat(val).toFixed(2));

        return {
          name: dayLabel, 
          fullDate: item.date, 
          real: !isFutureMonth ? val : null,
          pred: isFutureMonth ? val : null,
        };
      });
      
      // 🌟 [원천 해결] 데이터 꼬임을 만들던 가상 가공 레이어(Fallback)를 완전히 제거하여 
      // 백엔드가 준 실제 DB 데이터(27.82 등)가 다이렉트로 차트에 꽂히도록 처리합니다.
      setData(formatted);

    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setData([]); 
    } finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchData(); 
  }, [selectedYear, selectedMonth]); 

  const realValues = data.map(d => d.real).filter(v => v !== null);
  const maxRealUsage = realValues.length > 0 ? Math.max(...realValues) : 0;

  return (
    <div className="electric-page" style={{ padding: '20px', background: '#f4f7fb' }}>
      <div className="electric-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#1a202c', fontSize: '28px', fontWeight: 'bold' }}>일별 사용량 및 AI 미래 예측</h1>
      </div>
      
      <div className="electric-filter" style={{ display: 'flex', gap: '10px', marginBottom: '25px', justifyContent: 'center', alignItems: 'center' }}>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{ padding: '8px 15px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccd0d5', background: '#fff' }}>
          <option value="2024">2024년</option>
          <option value="2025">2025년</option>
          <option value="2026">2026년</option>
        </select>

        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ padding: '8px 15px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccd0d5', background: '#fff' }}>
          <option value="01">01월 [실측 기록]</option>
          <option value="02">02월 [실측 기록]</option>
          <option value="03">03월 [실측 기록]</option>
          <option value="04">04월 [실측 기록]</option>
          <option value="05">05월 [AI 미래 예측]</option>
        </select>
        <button className="search-btn" onClick={fetchData} style={{ padding: '8px 25px', background: '#0b4c91', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>조회</button>
      </div>

      <div className="chart-box" style={{ display: 'block', height: '480px', width: '100%', minWidth: '300px', background: '#fff', padding: '25px', border: '1px solid #d9dee7', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        {loading ? (
          <div className="chart-placeholder" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#0b4c91', fontWeight: 'bold', fontSize: '16px' }}>
            🔄 WattMate AI 엔진이 전력 소비 패턴 리포트를 빌드하고 있습니다...
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" minHeight={400}>
            <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#555' }} height={40} />
              <YAxis unit=" kWh" tick={{ fontSize: 12, fill: '#555' }} axisLine={false} tickLine={false} />
              
              <Tooltip formatter={(value, name) => [`${value} kWh`, name]} contentStyle={{ borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'rgba(255, 255, 255, 0.95)' }} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '25px', fontSize: '13px' }} />

              {/* 📊 1. 과거 실측 데이터 (민트색 막대) */}
              <Bar dataKey="real" name="당일 실측 사용량" barSize={14} radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.real === maxRealUsage ? '#e02b20' : '#4bc0c0'} />
                ))}
              </Bar>

              {/* 📊 2. AI 예측 데이터 (회색 막대) */}
              <Bar dataKey="pred" name="[AI 예측] 일별 예상 전력량" barSize={14} radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={index} fill="#7f8c8d" /> 
                ))}
              </Bar>

              {/* 📈 3. [AI 예측] 소비 궤적 트렌드 선 (오렌지색 선) */}
              <Line 
                type="monotone" 
                dataKey="pred" 
                name="[AI 예측] 소비 궤적 트렌드" 
                stroke="#ff9f40" 
                strokeWidth={3} 
                dot={{ r: 3, strokeWidth: 2, fill: '#fff', stroke: '#ff9f40' }} 
                activeDot={{ r: 6 }}
                connectNulls={true} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-placeholder" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>
            조회 데이터 공백: 먼저 대시보드에서 전력 관리 CSV 파일을 마스터 업로드해 주세요.
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyStats;