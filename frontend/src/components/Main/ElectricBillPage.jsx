import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ElectricBillEstimator, { calculateElectricBill } from './ElectricBillEstimator';

// 🌟 시연용 기준 연도 고정 (필요시 데이트 객체로 유연화 가능)
const SUMMARY_YEAR = 2026;
const now = new Date();
const CURRENT_MONTH = now.getMonth() + 1; // 실시간 현재 월 추적

const ElectricBillPage = ({ view = 'estimate' }) => {
  const [yearlyData, setYearlyData] = useState([]); // 1~12월 전체 데이터 저장 장부
  const [tariffType, setTariffType] = useState('low'); // 'low'(저압) 또는 'high'(고압) 실시간 연동 토글
  const [loading, setLoading] = useState(true);

  // 현재 월의 사용량 필터링용 변수
  const monthlyUsage = useMemo(() => {
    const currentData = yearlyData.find((item) => item.month === CURRENT_MONTH);
    return currentData ? currentData.usage : 0;
  }, [yearlyData]);

  useEffect(() => {
    const fetchYearlyUsage = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // [A] 백엔드에서 해당 연도의 모든 월별 데이터 일괄 수집
        const response = await axios.get('http://43.201.202.195:8080/api/power/monthly', {
          params: {
            userId: parseInt(userId, 10),
            year: SUMMARY_YEAR,
          },
        });

        // [B] 1월부터 12월까지 빈 껍데기 틀을 미리 생성 (데이터가 없는 달도 표기하기 위함)
        const fullYearSlots = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          usage: 0,
        }));

        // [C] 백엔드 데이터를 1~12월 슬롯에 1:1 정밀 바인딩
        response.data.forEach((item) => {
          const m = Number(item.month);
          if (m >= 1 && m <= 12) {
            fullYearSlots[m - 1].usage = Number(parseFloat(item.usage).toFixed(2));
          }
        });

        setYearlyData(fullYearSlots);
      } catch (error) {
        console.error('월별 전기요금 연동 내역 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYearlyUsage();
  }, []);

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', fontWeight: 'bold', color: '#1f4e79' }}>연간 전기요금 통계 장부 분석 중...</div>;
  }

  return (
    <div className="bill-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
      
      {/* 🌟 1. [신설] 월별 전기요금 내역 일괄 비교 테이블 대시보드 */}
      <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '35px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, color: '#222' }}>📅 {SUMMARY_YEAR}년 월별 전기요금 지출 내역</h3>
            <p style={{ fontSize: '13px', color: '#777', marginTop: '5px' }}>각 월별 총 사용량에 따른 정밀 누진세 적용 확정 요금 보고서입니다.</p>
          </div>
          
          {/* ⚡ 저압/고압 선택 스위치 (하단 요금표 컴포넌트와 실시간 상태 동기화) */}
          <div style={{ background: '#f1f3f5', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
            <button 
              onClick={() => setTariffType('low')}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', background: tariffType === 'low' ? '#1f4e79' : 'transparent', color: tariffType === 'low' ? '#fff' : '#666' }}
            >
              아파트 저압 기준
            </button>
            <button 
              onClick={() => setTariffType('high')}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', background: tariffType === 'high' ? '#1f4e79' : 'transparent', color: tariffType === 'high' ? '#fff' : '#666' }}
            >
              아파트 고압 기준
            </button>
          </div>
        </div>

        {/* 📊 한눈에 보기 편한 세련된 모던 그리드 표 */}
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #eef1f6' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eef1f6', height: '45px', fontWeight: '700', color: '#495057' }}>
                <th style={{ padding: '12px' }}>월별 구분</th>
                <th>월간 총 사용량</th>
                <th>기본요금</th>
                <th>전력량 요금</th>
                <th style={{ background: '#edf2ff', color: '#364fc7' }}>총 청구 요금</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.map((data) => {
                // 기존 가동중인 요금 계산 함수 엔진 연동
                const calculated = calculateElectricBill(data.usage, tariffType);
                const isCurrentMonth = data.month === CURRENT_MONTH;

                return (
                  <tr 
                    key={data.month} 
                    style={{ 
                      borderBottom: '1px solid #f1f3f5', 
                      height: '48px',
                      background: isCurrentMonth ? '#fff9db' : 'transparent', // 이번 달은 연노랑색 강조 하이라이트
                      fontWeight: isCurrentMonth ? 'bold' : 'normal'
                    }}
                  >
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#1f4e79' }}>{data.month}월</td>
                    <td style={{ color: '#333' }}>{data.usage > 0 ? `${data.usage.toLocaleString()} kWh` : '-'}</td>
                    <td style={{ color: '#666' }}>{data.usage > 0 ? `${calculated.baseFee.toLocaleString()}원` : '-'}</td>
                    <td style={{ color: '#666' }}>{data.usage > 0 ? `${calculated.energyCharge.toLocaleString()}원` : '-'}</td>
                    <td style={{ background: isCurrentMonth ? '#fff3bf' : '#f8f9fa', fontWeight: '700', color: '#2b8a3e' }}>
                      {data.usage > 0 ? `${calculated.total.toLocaleString()}원` : '-'}
                    </td>
                    <td>
                      {isCurrentMonth ? (
                        <span style={{ fontSize: '11px', background: '#f59f00', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>이번달 (예측)</span>
                      ) : data.usage > 0 ? (
                        <span style={{ fontSize: '11px', background: '#37b24d', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>정산 완료</span>
                      ) : (
                        <span style={{ fontSize: '11px', background: '#dee2e6', color: '#868e96', padding: '2px 6px', borderRadius: '4px' }}>내역 없음</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🌟 2. 기존 예측기 및 요금표 컴포넌트 레이아웃 배치 */}
      {/* 상태 변수인 tariffType과 선택 함수를 동적 바인딩하여 위아래 스위치가 묶여서 작동하도록 개조 */}
      <div style={{ background: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '10px' }}>
        <ElectricBillEstimator
          monthlyUsage={monthlyUsage}
          summaryYear={SUMMARY_YEAR}
          summaryMonth={CURRENT_MONTH}
          view={view}
        />
      </div>

    </div>
  );
};

export default ElectricBillPage;