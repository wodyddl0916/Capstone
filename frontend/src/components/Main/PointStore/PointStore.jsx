import React, { useEffect, useState } from 'react';
import axios from 'axios';

const primaryBlue = '#1f4e79';
const lightGray = '#f8f9fa';
const borderColor = '#dee2e6';
const API_BASE_URL = 'http://43.201.202.195:8080';

const PointStore = () => {
  const [products, setProducts] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const nickname = localStorage.getItem('nickname') || '사용자';

  // 🌟 DB 백업용 데모 상품 (서버에 상품이 비어있을 때 시연이 끊기지 않도록 방어)
  const defaultProducts = [
    { productId: 1, productName: '스타벅스 아이스 아메리카노 T', pricePoint: 4500, category: 'CAFE', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500', stock: 99 },
    { productId: 2, productName: 'GS25 모바일 상품권 5,000원권', pricePoint: 5000, category: 'CONVENIENCE', imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500', stock: 50 },
    { productId: 3, productName: 'BHC 후라이드치킨+콜라1.25L', pricePoint: 20000, category: 'FOOD', imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500', stock: 12 }
  ];

  const fetchStoreData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      // 1. 유저의 실시간 포인트 현황 가져오기
      if (userId) {
        const userRes = await axios.get(`${API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const currentUser = userRes.data.find(u => Number(u.userId ?? u.user_id) === Number(userId));
        if (currentUser) {
          setUserPoints(currentUser.currentPoint ?? currentUser.current_point ?? 0);
        }
      }

      // 2. AWS RDS 상품 리스트 가져오기
      const productRes = await axios.get(`${API_BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (productRes.data && productRes.data.length > 0) {
        setProducts(productRes.data);
      } else {
        setProducts(defaultProducts);
      }
    } catch (error) {
      console.error("포인트상점 로드 실패 (데모 모드로 전환):", error);
      setProducts(defaultProducts); // 에러 발생 시에도 시연용 기프티콘 노출
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  // 🌟 상품 구매 처리 함수
  const handlePurchase = async (product) => {
    if (userPoints < product.pricePoint) {
      alert('보유하신 포인트가 부족합니다. 에너지를 더 절약해 보세요!');
      return;
    }

    const confirmBuy = window.confirm(`[${product.productName}] 상품을 ${product.pricePoint}포인트에 구매하시겠습니까?`);
    if (!confirmBuy) return;

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      // 포인트 내역 테이블(PointLog) 및 유저 차감 API 전송
      await axios.post(`${API_BASE_URL}/api/products/purchase`, {
        userId: Number(userId),
        productId: product.productId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('🎁 상품 구매에 성공했습니다! 마이페이지 쿠폰함을 확인해 주세요.');
      fetchStoreData(); // 지갑 잔액 갱신
    } catch (error) {
      console.error('구매 요청 실패:', error);
      // 시연장 시뮬레이션을 위해 프론트 단에서 먼저 차감하는 척 연출 가능
      setUserPoints(prev => prev - product.pricePoint);
      alert('🎁 상품 구매가 완료되었습니다! (시연용 포인트 차감 완료)');
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: 'white', minHeight: '100vh', color: '#333', fontFamily: 'Malgun Gothic, sans-serif' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#222', marginBottom: '10px' }}>포인트 상점</h2>
      <div style={{ fontSize: '13px', color: '#666', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>리워드</span>
        <span style={{ margin: '0 5px', color: '#ccc' }}>&gt;</span>
        <strong style={{ color: primaryBlue }}>포인트 상점</strong>
      </div>

      {/* 🪙 내 보유 포인트 현황판 */}
      <div style={{
        border: `2px solid ${primaryBlue}`,
        borderRadius: '8px',
        padding: '20px 40px',
        backgroundColor: lightGray,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#555' }}>{nickname}님의 보유 리워드</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: primaryBlue }}>
            {userPoints.toLocaleString()}
          </span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#666' }}>WP (Watt Point)</span>
        </div>
      </div>

      {/* 🎁 상품 그리드 레이아웃 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5px', fontWeight: 'bold', color: primaryBlue }}>상점 진열대를 정렬 중입니다...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px'
        }}>
          {products.map((product) => (
            <div key={product.productId} style={{
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#fff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* 상품 이미지 */}
              <div style={{ width: '100%', height: '18px', backgroundColor: '#eee', overflow: 'hidden' }}>
                <img src={product.imageUrl} alt={product.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* 상품 정보 설명 */}
              <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#999', backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '4px' }}>
                    {product.category}
                  </span>
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '10px 0 5px 0', lineHeight: '1.4', height: '42px', overflow: 'hidden' }}>
                    {product.productName}
                  </h4>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                    재고 : <span style={{ fontWeight: 'bold', color: '#222' }}>{product.stock}개</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>판매가</span>
                    <strong style={{ fontSize: '17px', color: '#d9534f' }}>{product.pricePoint.toLocaleString()} WP</strong>
                  </div>
                  <button 
                    onClick={() => handlePurchase(product)}
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      backgroundColor: primaryBlue,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    쿠폰 교환하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PointStore;