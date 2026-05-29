import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateElectricBill } from './ElectricBillEstimator';

const now = new Date();
const SUMMARY_YEAR = now.getFullYear();
const SUMMARY_MONTH = now.getMonth() + 1;

const getProjectedMonthlyUsage = (usage) => {
  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const progressRatio = currentDay / daysInMonth;

  return usage > 0 ? usage / Math.max(progressRatio, 0.01) : 0;
};

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  // 📍 [추가된 부분 1] 사용자 요약 정보(월간 총 전력, 요금, 리워드)를 담을 상태(State)
  const [summaryData, setSummaryData] = useState({
    monthlyTotalPower: 0,
    cost: 0,
    reward: 0
  });

  // ⚠️ 발급받은 네이버 API 키를 여기에 입력하세요
  const CLIENT_ID = 'e6iY6B8jHFd4FmmWQp3H'; 
  const CLIENT_SECRET = 'rSLoWWuBQx';

  // 뉴스 배너를 가져오는 useEffect
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
        
        if (!response.ok) throw new Error('네트워크 응답에 문제가 있습니다.');
        
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
          { 
            title: "ENERGY MATE", 
            subtitle: "지구를 구하는 스마트한 전력 관리", 
            bgImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1920&auto=format&fit=crop" 
          },
          { 
            title: "AI INSIGHT", 
            subtitle: "데이터로 보는 우리 집 에너지", 
            bgImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1920&auto=format&fit=crop" 
          }
        ]);
        setLoading(false);
      }
    };

    fetchEnergyNews();
  }, []);

  // 📍 [추가된 부분 2] 백엔드에서 사용자 요약 정보(전력, 요금 등)를 가져오는 useEffect
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const userId = localStorage.getItem('userId');

        const nextSummaryData = {
          monthlyTotalPower: 0,
          cost: 0,
          reward: 1500
        };

        if (userId) {
          const response = await axios.get('http://43.201.202.195:8080/api/power/monthly', {
            params: {
              userId: parseInt(userId, 10),
              year: SUMMARY_YEAR
            }
          });

          const monthData = response.data.find((item) => Number(item.month) === SUMMARY_MONTH);
          nextSummaryData.monthlyTotalPower = monthData
            ? Number(parseFloat(monthData.usage).toFixed(2))
            : 0;
        }

        nextSummaryData.cost = calculateElectricBill(
          getProjectedMonthlyUsage(nextSummaryData.monthlyTotalPower),
          'high'
        ).total;

        setSummaryData(nextSummaryData);
      } catch (error) {
        console.error("사용자 데이터 로드 실패:", error);
      }
    };

    fetchSummaryData();
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행됨

  // 슬라이드 타이머
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>최신 에너지 소식을 불러오는 중...</div>;

  return (
    <>
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
      
      <div className="content-container">
        <div className="summary-section">
          {/* 📍 [추가된 부분 3] 고정된 텍스트 대신 state(summaryData) 값으로 변경 */}
          <div className="summary-box">
            <span>이번달 총 전력 ({SUMMARY_YEAR}년 {SUMMARY_MONTH}월)</span>
            <strong>{summaryData.monthlyTotalPower.toLocaleString()} kWh</strong>
          </div>
          <div className="summary-box border-side">
            <span>예상 요금</span>
            <strong>{summaryData.cost.toLocaleString()} 원</strong>
          </div>
          <div className="summary-box">
            <span>리워드</span>
            <strong style={{color: '#7a9e7c'}}>{summaryData.reward.toLocaleString()} P</strong>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
