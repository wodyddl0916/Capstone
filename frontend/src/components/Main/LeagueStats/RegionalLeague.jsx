import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const primaryBlue = '#1f4e79';
const lightGray = '#f8f9fa';
const borderColor = '#dee2e6';
const API_BASE_URL = '';

const monthOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const yearOptions = ['2024', '2025', '2026'];

const getRankLabel = (index) => String(index + 1).padStart(2, '0');

const getPreviousPeriod = (year, month) => {
  const numericYear = Number(year);
  const numericMonth = Number(month);

  if (numericMonth === 1) {
    return { year: numericYear - 1, month: 12 };
  }

  return { year: numericYear, month: numericMonth - 1 };
};

const getUsageValue = (monthData) => {
  if (!monthData) return null;

  const rawUsage =
    monthData.usage ??
    monthData.totalUsage ??
    monthData.total_usage ??
    monthData.usageKwh ??
    monthData.usage_kwh;

  if (rawUsage === undefined || rawUsage === null || rawUsage === '') return null;

  const parsedUsage = Number.parseFloat(rawUsage);
  return Number.isNaN(parsedUsage) ? null : Number(parsedUsage.toFixed(2));
};

const formatUsage = (usage) => (
  usage === null ? '데이터 없음' : `${usage.toLocaleString()} kWh`
);

const formatSavingDifference = (saving) => {
  if (saving === null) return '비교 불가';
  if (saving > 0) return `${saving.toLocaleString()} kWh 절약`;
  if (saving < 0) return `${Math.abs(saving).toLocaleString()} kWh 더 사용`;
  return '변동 없음';
};

const RegionalLeague = () => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('04');
  const [rankingList, setRankingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentUserId = Number(localStorage.getItem('userId'));
  const previousPeriod = getPreviousPeriod(selectedYear, selectedMonth);

  // 내 순위 정보 동적 연산
  const myRankInfo = useMemo(() => {
    const myRow = rankingList.find((item) => item.userId === currentUserId);

    if (!myRow) {
      return {
        nickname: localStorage.getItem('nickname') || '로그인 사용자',
        rank: '순위 없음',
        usage: '-'
      };
    }

    return {
      nickname: myRow.nickname,
      rank: `${myRow.rank}위`,
      usage: formatSavingDifference(myRow.saving)
    };
  }, [currentUserId, rankingList]);

  // 리그 전체 평균 전력 소모량 연산
  const averageUsage = useMemo(() => {
    const validUsages = rankingList
      .map((item) => item.usage)
      .filter((usage) => usage !== null);

    if (validUsages.length === 0) return null;

    const totalUsage = validUsages.reduce((sum, usage) => sum + usage, 0);
    return Number((totalUsage / validUsages.length).toFixed(2));
  }, [rankingList]);

  // 🌟 [성진님 기획 장착] 실시간 상위 % 계산 및 예상 리워드 배정 연산 파이프라인
  const estimatedRewardInfo = useMemo(() => {
    if (rankingList.length === 0) return { percentile: 0, reward: '0 WP' };
    
    const myIndex = rankingList.findIndex((item) => item.userId === currentUserId);
    if (myIndex === -1) return { percentile: 0, reward: '0 WP' };

    const myRank = rankingList[myIndex].rank;
    const total = rankingList.length;
    const percentile = (myRank / total) * 100; // 상위 몇 % 인지 산출

    let reward = '0 WP';
    if (percentile <= 5.0) reward = '3,000 WP';
    else if (percentile <= 15.0) reward = '2,000 WP';
    else if (percentile <= 30.0) reward = '1,000 WP';
    else if (percentile <= 50.0) reward = '500 WP';

    return {
      percentile: percentile.toFixed(1),
      reward
    };
  }, [rankingList, currentUserId]);

  // 🌟 JWT 토큰 인증 헤더를 포함한 실시간 전체 랭킹 취합 파이프라인
  const fetchMonthlyRanking = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setErrorMessage('로그인 정보가 없거나 세션이 만료되었습니다. 다시 로그인해 주세요.');
        setLoading(false);
        return;
      }

      const usersResponse = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const dbUsers = usersResponse.data;

      if (!dbUsers || dbUsers.length === 0) {
        setRankingList([]);
        return;
      }

      const rows = await Promise.all(
        dbUsers.map(async (user) => {
          const uId = user.userId ?? user.user_id;
          const nick = user.nickname ?? '알 수 없는 사용자';

          try {
            const response = await axios.get(`${API_BASE_URL}/api/power/monthly`, {
              params: {
                userId: uId,
                year: Number(selectedYear)
              },
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            const previousResponse = previousPeriod.year === Number(selectedYear)
              ? response
              : await axios.get(`${API_BASE_URL}/api/power/monthly`, {
                params: {
                  userId: uId,
                  year: previousPeriod.year
                },
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });

            const monthData = response.data.find(
              (item) => Number(item.month) === Number(selectedMonth)
            );
            const previousMonthData = previousResponse.data.find(
              (item) => Number(item.month) === previousPeriod.month
            );

            const usage = getUsageValue(monthData);
            const previousUsage = getUsageValue(previousMonthData);
            const saving = usage !== null && previousUsage !== null
              ? Number((previousUsage - usage).toFixed(2))
              : null;

            return {
              userId: uId,
              nickname: nick,
              usage,
              previousUsage,
              saving
            };
          } catch (error) {
            console.error(`${nick} 월별 데이터 조회 실패:`, error);
            return {
              userId: uId,
              nickname: nick,
              usage: null,
              previousUsage: null,
              saving: null
            };
          }
        })
      );

      const sortedRows = rows
        .sort((a, b) => {
          if (a.saving === null) return 1;
          if (b.saving === null) return -1;
          return b.saving - a.saving;
        })
        .map((item, index) => ({
          ...item,
          rank: index + 1
        }));

      setRankingList(sortedRows);
    } catch (error) {
      console.error('월별 DB 리그 데이터 분석 실패:', error);
      setRankingList([]);
      setErrorMessage('인증에 실패했거나 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyRanking();
  }, [selectedYear, selectedMonth]);

  return (
    <div style={{ padding: '30px', backgroundColor: 'white', minHeight: '100vh', color: '#333', fontFamily: 'Malgun Gothic, dotum, sans-serif' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#222', marginBottom: '10px' }}>지역 리그 순위</h2>
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
        <span>리그통계</span>
        <span style={{ margin: '0 5px', color: '#ccc' }}>&gt;</span>
        <strong style={{ color: primaryBlue }}>지역 리그 순위</strong>
      </div>

      {/* 🌟 [수정] 성진님 기획에 따른 4칸짜리 종합 모니터링 대시보드 */}
      <div style={{
        border: `2px solid ${primaryBlue}`,
        borderRadius: '8px',
        padding: '20px 30px',
        backgroundColor: lightGray,
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr 0.9fr 1.2fr',
        gap: '15px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '90px', fontWeight: 'bold', textAlign: 'center' }}>내 닉네임</span>
          <div style={{ flex: 1, backgroundColor: '#e9ecef', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ced4da' }}>
            {myRankInfo.nickname}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '90px', fontWeight: 'bold', textAlign: 'center' }}>절약 순위</span>
          <div style={{ flex: 1, backgroundColor: '#e9ecef', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ced4da', color: '#0056b3', fontWeight: 'bold' }}>
            {myRankInfo.rank} / {myRankInfo.usage}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '90px', fontWeight: 'bold', textAlign: 'center' }}>전체 평균</span>
          <div style={{ flex: 1, backgroundColor: '#e9ecef', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ced4da', color: '#d9534f', fontWeight: 'bold' }}>
            {averageUsage === null ? '데이터 없음' : `${averageUsage.toLocaleString()} kWh`}
          </div>
        </div>
        {/* 🌟 이번 달 예상 리워드 패널 신설 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '110px', fontWeight: 'bold', textAlign: 'center', color: '#1f8f4d', lineHeight: 1.35 }}>
            이번달 예상
            <br />
            리워드
          </span>
          <div style={{ flex: 1, backgroundColor: '#e6f4ea', padding: '8px 12px', borderRadius: '4px', border: '1px solid #a3cfbb', color: '#137333', fontWeight: 'bold', textAlign: 'center' }}>
            {estimatedRewardInfo.reward} <span style={{ fontSize: '11px', color: '#555', fontWeight: 'normal' }}>(상위 {estimatedRewardInfo.percentile}%)</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', justifyContent: 'center', alignItems: 'center' }}>
        <strong>조회 월 선택 :</strong>
        <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} style={{ padding: '8px 15px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccd0d5', background: '#fff' }}>
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}년</option>
          ))}
        </select>
        <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} style={{ padding: '8px 15px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccd0d5', background: '#fff' }}>
          {monthOptions.map((month) => (
            <option key={month} value={month}>{month}월</option>
          ))}
        </select>
        <button onClick={fetchMonthlyRanking} style={{ padding: '8px 25px', background: primaryBlue, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          조회
        </button>
      </div>

      <div style={{ borderTop: `2px solid ${primaryBlue}`, marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ backgroundColor: lightGray }}>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}`, width: '12%' }}>절약 순위</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}`, width: '22%' }}>닉네임</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}`, width: '22%' }}>{Number(selectedMonth)}월 총 전력량</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}`, width: '22%' }}>{previousPeriod.year}년 {previousPeriod.month}월 총 전력량</th>
              <th style={{ padding: '12px', border: `1px solid ${borderColor}`, width: '22%' }}>전월 대비 차이</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '30px', border: `1px solid ${borderColor}`, textAlign: 'center', color: primaryBlue, fontWeight: 'bold' }}>
                  전월 대비 절약 순위를 불러오는 중입니다...
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan="5" style={{ padding: '30px', border: `1px solid ${borderColor}`, textAlign: 'center', color: '#d9534f', fontWeight: 'bold' }}>
                  {errorMessage}
                </td>
              </tr>
            ) : rankingList.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '30px', border: `1px solid ${borderColor}`, textAlign: 'center', color: '#888' }}>
                  조회된 사용자 전력 사용량 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              rankingList.map((item, index) => {
                const isCurrentUser = item.userId === currentUserId;

                return (
                  <tr key={item.userId} style={{ textAlign: 'center', backgroundColor: isCurrentUser ? '#fff8e1' : 'white' }}>
                    <td style={{ padding: '12px', border: `1px solid ${borderColor}`, backgroundColor: isCurrentUser ? '#fff3cd' : lightGray, fontWeight: 'bold' }}>
                      {getRankLabel(index)}
                    </td>
                    <td style={{ padding: '12px', border: `1px solid ${borderColor}`, fontWeight: isCurrentUser ? 'bold' : 'normal' }}>
                      {item.nickname}
                    </td>
                    <td style={{ padding: '12px', border: `1px solid ${borderColor}`, backgroundColor: isCurrentUser ? '#fff8e1' : lightGray, color: item.usage === null ? '#999' : '#d9534f', fontWeight: 'bold' }}>
                      {formatUsage(item.usage)}
                    </td>
                    <td style={{ padding: '12px', border: `1px solid ${borderColor}`, color: item.previousUsage === null ? '#999' : '#0056b3', fontWeight: 'bold' }}>
                      {formatUsage(item.previousUsage)}
                    </td>
                    <td style={{ padding: '12px', border: `1px solid ${borderColor}`, color: item.saving === null ? '#999' : item.saving >= 0 ? '#1f8f4d' : '#d9534f', fontWeight: 'bold' }}>
                      {formatSavingDifference(item.saving)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegionalLeague;
