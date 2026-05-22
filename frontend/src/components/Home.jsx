import React, { useState, useEffect } from 'react';

const Home = () => {
  const [activeBanner, setActiveBanner] = useState(0);
  const banners = [
    { title: "ENERGY MATE", subtitle: "지구를 구하는 스마트한 전력 관리", bgColor: "#b2c3b9" },
    { title: "AI INSIGHT", subtitle: "데이터로 보는 우리 집 에너지", bgColor: "#9dadad" },
    { title: "REWARDS", subtitle: "절약한 만큼 쌓이는 혜택", bgColor: "#c5d1c9" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <>
      <section className="hero-section">
        {banners.map((banner, index) => (
          <div 
            key={index}
            className={`hero-slide ${activeBanner === index ? 'active' : ''}`}
            style={{ backgroundColor: banner.bgColor }}
          >
            <div className="hero-content">
              <h4>{banner.title}</h4>
              <h1>{banner.subtitle}</h1>
              <button className="hero-btn">자세히 보기</button>
            </div>
          </div>
        ))}
      </section>
      
      <div className="content-container">
        <div className="summary-section">
          <div className="summary-box"><span>실시간 전력</span><strong>0.45 kWh</strong></div>
          <div className="summary-box border-side"><span>예상 요금</span><strong>38,200 원</strong></div>
          <div className="summary-box"><span>리워드</span><strong style={{color: '#7a9e7c'}}>1,500 P</strong></div>
        </div>
      </div>
    </>
  );
};

export default Home;