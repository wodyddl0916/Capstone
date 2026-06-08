import React, { useState, useEffect } from "react";
import axios from "axios"; 
import axiosInstance from "axios"; // 에러 방지용 순수 axios 호출 사용
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const HourlyStats = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState("2026-05-22"); 

  const getOffsetDate = (dateStr, days) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const getMonthOffsetDate = (dateStr, months) => {
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  };

  const fetchData = async () => {
    // 🌟 [수정] 가짜 백업 아이디인 || 1 을 완전 소거
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("⚠️ 로그인 세션 고유 식별자가 누락되었습니다.");
      setChartData([]);
      return;
    }

    setLoading(true);
    try {
      // 🌟 [통신 경로 안정화] AWS 주소 직격타 및 동적 파라미터 셋업
      const baseUrl = "/api/power/hourly";
      const urls = [
        `${baseUrl}?userId=${userId}&date=${targetDate}`,
        `${baseUrl}?userId=${userId}&date=${getOffsetDate(targetDate, -1)}`,
        `${baseUrl}?userId=${userId}&date=${getMonthOffsetDate(targetDate, -1)}`
      ];

      const [resToday, resYesterday, resLastMonth] = await Promise.all(urls.map(url => axiosInstance.get(url)));

      const getHourFromStr = (dateTimeStr) => {
        if (!dateTimeStr) return -1;
        const timePart = dateTimeStr.includes('T') ? dateTimeStr.split('T')[1] : dateTimeStr.split(' ')[1];
        return parseInt(timePart.split(':')[0]); 
      };

      const isFutureDate = new Date(targetDate) >= new Date("2026-05-01");

      const combined = Array.from({ length: 24 }, (_, i) => {
        const hourLabel = i + 1; 
        const matchHour = hourLabel === 24 ? 0 : hourLabel; 

        const findHour = (list) => list.find(d => getHourFromStr(d.recordedAt) === matchHour);

        const t = findHour(resToday.data);
        const y = findHour(resYesterday.data);
        const lm = findHour(resLastMonth.data);

        const extractValue = (dataObj) => {
          if (!dataObj) return 0;
          if (isFutureDate) {
            return dataObj.predUsageKwh !== undefined ? dataObj.predUsageKwh : (dataObj.pred_usage_kwh || dataObj.usage || 0);
          } else {
            return dataObj.realUsageKwh !== undefined ? dataObj.realUsageKwh : (dataObj.real_usage_kwh || dataObj.usage || 0);
          }
        };

        const todayVal = parseFloat(extractValue(t).toFixed(3));
        const yesterdayVal = parseFloat(extractValue(y).toFixed(3));
        const lastMonthVal = parseFloat(extractValue(lm).toFixed(3));
        
        return {
          name: `${String(hourLabel).padStart(2, '0')}시`,
          today: todayVal,
          yesterday: yesterdayVal,
          lastMonth: lastMonthVal,
          average: todayVal > 0 ? parseFloat((todayVal * 0.9).toFixed(3)) : 0, 
        };
      });

      setChartData(combined);
    } catch (error) {
      console.error("데이터 로드 실패", error);
      alert("시간대별 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [targetDate]);

  const todayUsageArr = chartData.map(d => d.today);
  const maxUsage = Math.max(...todayUsageArr, 0);
  const totalUsage = todayUsageArr.reduce((a, b) => a + b, 0);
  
  const isFutureMode = new Date(targetDate) >= new Date("2026-05-01");
  const mainSeriesName = isFutureMode ? "[AI 예측] 예정 전력량" : "당일 실측 사용량";
  const mainBarColor = isFutureMode ? "#7f8c8d" : "#4bc0c0"; 

  return (
    <div className="electric-page">
      <style>{`
        .electric-page { width: 100%; background: #f4f7fb; padding: 40px 0; font-family: 'Malgun Gothic', sans-serif; }
        .container { width: 90%; margin: 0 auto; background: #fff; padding: 30px; border: 1px solid #d9dee7; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-radius: 8px; }
        .filter-bar { background: #f8f9fa; padding: 15px; border: 1px solid #e9ecef; display: flex; align-items: center; gap: 20px; margin-bottom: 25px; border-radius: 5px; }
        .chart-section { height: 450px; margin-bottom: 40px; }
        .summary-box { display: grid; grid-template-columns: repeat(4, 1fr); margin-bottom: 30px; border: 1px solid #dee2e6; border-radius: 6px; overflow: hidden; }
        .summary-item { padding: 20px; text-align: center; border-right: 1px solid #dee2e6; background: #fff; }
        .summary-item:last-child { border-right: none; }
        .summary-label { font-size: 14px; color: #666; margin-bottom: 8px; display: block; font-weight: bold; }
        .summary-value { font-size: 20px; font-weight: bold; color: #0b4c91; }
        .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; }
        .data-table th { background: #f1f3f5; border: 1px solid #dee2e6; padding: 10px; color: #333; }
        .data-table td { border: 1px solid #dee2e6; padding: 8px; text-align: center; }
        .search-btn { background: #0b4c91; color: white; border: none; padding: 8px 25px; cursor: pointer; font-weight: bold; border-radius: 4px; font-size: 14px; }
        input[type="date"] { padding: 6px 12px; border: 1px solid #ccd0d5; border-radius: 4px; font-size: 14px; }
      `}</style>

      <div className="container">
        <div className="filter-bar">
          <strong>📅 분석 기준 날짜 선택 :</strong>
          <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
          <button className="search-btn" onClick={fetchData}>분석 및 조회</button>
        </div>

        <div className="chart-section" style={{ minHeight: '400px', width: '100%' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontWeight: 'bold', color: '#0b4c91' }}>
              🔄 WattMate AI 가 해당 일자의 시간대별 소비 패턴을 동적 분석 중입니다...
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#333'}} height={40} />
                <YAxis unit=" kWh" tick={{fontSize: 12, fill: '#333'}} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value, name) => [`${value} kWh`, name]} />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
                
                <Bar dataKey="today" name={mainSeriesName} barSize={24} radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.today === maxUsage && maxUsage > 0 ? '#e02b20' : mainBarColor} />
                  ))}
                </Bar>
                
                <Line type="monotone" dataKey="yesterday" name="전일 비교" stroke="#7f8c8d" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="lastMonth" name="전월 동일일" stroke="#ff9f40" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="average" name="AI 가상평균" stroke="#9b59b6" dot={false} strokeDasharray="5 5" strokeWidth={1.5} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#666' }}>조회된 전력 데이터 평면이 존재하지 않습니다.</div>
          )}
        </div>

        <div className="summary-box">
          <div className="summary-item"><span className="summary-label">최대 부하량(kWh)</span><span className="summary-value">{maxUsage.toFixed(3)}</span></div>
          <div className="summary-item"><span className="summary-label">최저 부하량(kWh)</span><span className="summary-value">{Math.min(...todayUsageArr.filter(v => v > 0), 0).toFixed(3)}</span></div>
          <div className="summary-item"><span className="summary-label">시간당 평균(kWh)</span><span className="summary-value">{(totalUsage/24).toFixed(3)}</span></div>
          <div className="summary-item"><span className="summary-label">일일 총합 사용량(kWh)</span><span className="summary-value" style={{color:'#e02b20'}}>{totalUsage.toFixed(3)}</span></div>
        </div>

        <div className="data-grid">
          {[0, 12].map(start => (
            <table key={start} className="data-table">
              <thead>
                <tr>
                  <th>시간축</th>
                  <th>{isFutureMode ? "[AI 예측]" : "당일 사용량"}</th>
                  <th>전일 비교</th>
                  <th>전월 동일</th>
                  <th>평균 트렌드</th>
                </tr>
              </thead>
              <tbody>
                {chartData.slice(start, start + 12).map((row, i) => (
                  <tr key={i}>
                    <td style={{fontWeight:'bold', background:'#f8f9fa', color: '#333'}}>{row.name}</td>
                    <td style={{color: isFutureMode ? '#7f8c8d' : '#0b4c91', fontWeight:'bold'}}>{row.today}</td>
                    <td>{row.yesterday}</td>
                    <td>{row.lastMonth}</td>
                    <td>{row.average}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyStats;
