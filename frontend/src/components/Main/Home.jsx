import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 🌟 [요청 반영 1] 시연용 기준 월을 2026년 5월로 전격 고정 세팅
const SUMMARY_YEAR = 2026;
const SUMMARY_MONTH = 5;

// 🌟 [요청 반영 2] 올려주신 '한전 아파트 저압 누진 요금표' 정밀 연산 알고리즘 엔진
const calculateLowVoltageBill = (totalUsage) => {
  if (!totalUsage || totalUsage <= 0) return 0;
  
  let baseFee = 0;      // 기본요금
  let energyFee = 0;    // 전력량요금
  
  // 1. 기본요금 구간 판정
  if (totalUsage <= 100) baseFee = 400;
  else if (totalUsage <= 200) baseFee = 890;
  else if (totalUsage <= 300) baseFee = 1,560;
  else if (totalUsage <= 400) baseFee = 3,750;
  else if (totalUsage <= 500) baseFee = 7,110;
  else baseFee = 12,600;

  // 2. 전력량요금 누진세 구간별 쪼개기 연산
  let remainingUsage = totalUsage;

  // 1구간: 100kWh까지 (59.1원)
  if (remainingUsage > 100) {
    energyFee += 100 * 59.1;
    remainingUsage -= 100;
  } else {
    energyFee += remainingUsage * 59.1;
    remainingUsage = 0;
  }

  // 2구간: 다음 100kWh까지 (122.6원)
  if (remainingUsage > 0) {
    if (remainingUsage > 100) {
      energyFee += 100 * 122.6;
      remainingUsage -= 100;
    } else {
      energyFee += remainingUsage * 122.6;
      remainingUsage = 0;
    }
  }

  // 3구간: 다음 100kWh까지 (183.0원)
  if (remainingUsage > 0) {
    if (remainingUsage > 100) {
      energyFee += 100 * 183.0;
      remainingUsage -= 100;
    } else {
      energyFee += remainingUsage * 183.0;
      remainingUsage = 0;
    }
  }

  // 4구간: 다음 100kWh까지 (273.2원)
  if (remainingUsage > 0) {
    if (remainingUsage > 100) {
      energyFee += 100 * 273.2;
      remainingUsage -= 100;
    } else {
      energyFee += remainingUsage * 273.2;
      remainingUsage = 0;
    }
  }

  // 5구간: 다음 100kWh까지 (406.7원)
  if (remainingUsage > 0) {
    if (remainingUsage > 100) {
      energyFee += 100 * 406.7;
      remainingUsage -= 100;
    } else {
      energyFee += remainingUsage * 406.7;
      remainingUsage = 0;
    }
  }

  // 6구간: 500kWh 초과 (690.8원)
  if (remainingUsage > 0) {
    energyFee += remainingUsage * 690.8;
  }

  // 기본요금 + 전력량요금 합산 후 원단위 절사 정수형 반환
  return Math.floor(baseFee + energyFee);
};

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  // 대시보드 요약 정보 상태 관리 설정
  const [summaryData, setSummaryData] = useState({
    monthlyTotalPower: 0,
    cost: 0,
    reward: 0
  });

  const CLIENT_ID = 'e6iY6B8jHFd4FmmWQp3H'; 
  const CLIENT_SECRET = 'rSLoWWuBQx';

  // 1. 네이버 뉴스 API 연동 파트
  useEffect(() => {
    const fetchEnergyNews = async () => {
      try {
        const response = await fetch(
          `/v1/search/news.json?query=${encodeURIComponent('전력 에너지 절약')}&display=3&sort=date`,
          {
            headers: {
              'X-Naver-Client-Id': CLIENT_ID,
              'X-Naver-Client-Secret': CLIENT_SECRET,
            },
          }
        );
        
        if (!response.ok) throw new Error('네트워크 응답 오류');
        
        const data = await response.json();
        const bgImages = [
          'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1920&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1920&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1920&auto=format&fit=crop'
        ];

        const newsBanners = data.items.map((item, index) => ({
          title: "TODAY ENERGY NEWS",
          subtitle: item.title.replace(/(<([^>]+)>|&quot;|&apos;|&amp;)/gi, ""), 
          bgImage: bgImages[index % bgImages.length], 
          link: item.link
        }));

        setBanners(newsBanners);
        setLoading(false);
      } catch (error) {
        console.error("뉴스 로드 실패:", error);
        setBanners([
          { title: "ENERGY MATE", subtitle: "지구를 구하는 스마트한 전력 관리", bgImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1920&auto=format&fit=crop" },
          { title: "AI INSIGHT", subtitle: "데이터로 보는 우리 집 에너지", bgImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1920&auto=format&fit=crop" }
        ]);
        setLoading(false);
      }
    };

    fetchEnergyNews();
  }, []);

  // 2. 🌟 DB 총 전력 조회 및 저급 누진세 계산 + 내 남은 리워드 실시간 매칭 파트
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        
        let powerUsage = 0;
        let myCurrentPoint = 0;

        if (userId && token) {
          const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

          // [A] 2026년 5월 가구 총 전력 실적 데이터 수집
          const powerRes = await axios.get('/api/power/monthly', {
            params: { userId: parseInt(userId, 10), year: SUMMARY_YEAR }
          });
          const monthData = powerRes.data.find((item) => Number(item.month) === SUMMARY_MONTH);
          if (monthData) {
            powerUsage = Number(parseFloat(monthData.usage).toFixed(2));
          }

          // [B] 🌟 [요청 반영 3] 마이페이지와 완벽 결속되는 내 실제 계정의 실시간 남은 포인트 연동
          const userRes = await axios.get('/api/users', authHeaders);
          const matchedUser = userRes.data.find(u => Number(u.userId ?? u.user_id) === Number(userId));
          if (matchedUser) {
            myCurrentPoint = matchedUser.currentPoint ?? matchedUser.current_point ?? 0;
          }
        }

        // [C] 🌟 [요청 반영 4] 저압 누진제 알고리즘 함수 호출을 통한 정밀 예상 요금 산출
        const finalCalculatedCost = calculateLowVoltageBill(powerUsage);

        setSummaryData({
          monthlyTotalPower: powerUsage,
          cost: finalCalculatedCost,
          reward: myCurrentPoint
        });
      } catch (error) {
        console.error("대시보드 종합 데이터 연동 예외 발생:", error);
      }
    };

    fetchSummaryData();
  }, []);

  // 뉴스 배너 자동 슬라이드
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) return <div style={{padding: '50px', textAlign: 'center', fontWeight: 'bold'}}>최신 에너지 소식을 불러오는 중...</div>;

  return (
    <>
      {/* 히로 배너 영역 */}
      <section className="hero-section">
        {banners.map((banner, index) => (
          <div 
            key={index}
            className={`hero-slide ${activeBanner === index ? 'active' : ''}`}
            style={{ 
              background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${banner.bgImage}) center/cover no-repeat`,
              cursor: 'pointer',
              color: 'white',
              pointerEvents: activeBanner === index ? 'auto' : 'none', 
              zIndex: activeBanner === index ? 10 : 1,
              transition: 'opacity 0.5s ease-in-out'
            }}
            onClick={() => banner.link && window.open(banner.link, '_blank')}
          >
            <div className="hero-content">
              <h4 style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)', color: '#e0e0e0' }}>{banner.title}</h4>
              <h1 style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)', color: 'white' }}>{banner.subtitle}</h1>
              <button className="hero-btn" style={{ borderColor: 'white', color: 'white', textShadow: 'none' }}>기사 읽기</button>
            </div>
          </div>
        ))}
      </section>
      
      {/* 🌟 와트메이트 5월 하이라이트 실시간 연동 대시보드 */}
      <div className="content-container">
        <div className="summary-section">
          {/* 총 전력 박스 (5월 타격 변경) */}
          <div className="summary-box">
            <span>이번달 총 전력 ({SUMMARY_YEAR}년 {SUMMARY_MONTH}월)</span>
            <strong style={{ letterSpacing: '0.5px' }}>
              {summaryData.monthlyTotalPower.toLocaleString()} kWh
            </strong>
          </div>
          
          {/* 정밀 저압 누진 요금 계산 박스 */}
          <div className="summary-box border-side">
            <span>예상 요금 (아파트 저압 기준)</span>
            <strong style={{ color: '#1f4e79' }}>
              {summaryData.cost.toLocaleString()} 원
            </strong>
          </div>
          
          {/* 🌟 남은 리워드 실시간 연동 박스 */}
          <div className="summary-box">
            <span>나의 남은 리워드 포인트</span>
            <strong style={{ color: '#4CAF50' }}>
              {summaryData.reward.toLocaleString()} WP
            </strong>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
