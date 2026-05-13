import React, { useState, useEffect } from 'react';

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  // ⚠️ 발급받은 네이버 API 키를 여기에 입력하세요
  const CLIENT_ID = 'e6iY6B8jHFd4FmmWQp3H'; 
  const CLIENT_SECRET = 'rSLoWWuBQx';

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

        // 📍 [추가된 부분 1] 배경으로 쓸 고화질 에너지 이미지 (Unsplash 무료 이미지)
        const bgImages = [
          'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1920&auto=format&fit=crop', // 풍력 발전
          'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1920&auto=format&fit=crop', // 태양광
          'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1920&auto=format&fit=crop'  // 친환경 숲
        ];

        const newsBanners = data.items.map((item, index) => ({
          title: "TODAY ENERGY NEWS",
          subtitle: item.title.replace(/(<([^>]+)>|&quot;|&apos;|&amp;)/gi, ""), 
          // bgColor 대신 이미지 URL을 넣습니다.
          bgImage: bgImages[index % bgImages.length], 
          link: item.link
        }));

        setBanners(newsBanners);
        setLoading(false);
      } catch (error) {
        console.error("뉴스 로드 실패:", error);
        // 에러 시 보여줄 기본 배너 (여기에도 이미지를 넣었습니다)
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
            // 📍 [수정된 부분 2] 단색 배경을 지우고, 이미지+어두운 필터를 한 번에 적용
            style={{ 
              background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${banner.bgImage}) center/cover no-repeat`,
              cursor: 'pointer',
              color: 'white', // 텍스트를 흰색으로
              // 📍 이 부분을 추가하세요! 활성화된 슬라이드만 클릭을 허용합니다.
              pointerEvents: activeBanner === index ? 'auto' : 'none', 
        // 📍 추가 팁: 투명도가 아닌 z-index로 확실히 맨 위로 올릴 수도 있습니다.
        zIndex: activeBanner === index ? 10 : 1,
        transition: 'opacity 0.5s ease-in-out' // 부드러운 전환 효과가 있다면
            }}
            onClick={() => banner.link && window.open(banner.link, '_blank')}
          >
            <div className="hero-content">
              {/* 📍 [수정된 부분 3] 배경 이미지 위에서 글씨가 잘 보이도록 그림자 효과 추가 */}
              <h4 style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)', color: '#e0e0e0' }}>{banner.title}</h4>
              <h1 style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)', color: 'white' }}>{banner.subtitle}</h1>
              <button className="hero-btn" style={{ borderColor: 'white', color: 'white', textShadow: 'none' }}>기사 읽기</button>
            </div>
          </div>
        ))}
      </section>
      
      <div className="content-container">
        <div className="summary-section">
          <div className="summary-box"><span>실시간 전력</span><strong>O.OO kWh</strong></div>
          <div className="summary-box border-side"><span>예상 요금</span><strong>O,OOO 원</strong></div>
          <div className="summary-box"><span>리워드</span><strong style={{color: '#7a9e7c'}}>O,OOO P</strong></div>
        </div>
      </div>
    </>
  );
};

export default Home;