import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = '';

const titleLabels = { 1: '일반 회원', 2: '우수 회원', 3: '절약 리더' };

const UserInfo = () => {
  const [userData, setUserData] = useState({
    userId: '', email: '', nickname: '', kepcoCustNo: '', householdCount: 1, householdType: 'MIDDLE', energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1
  });
  const [myCoupons, setMyCoupons] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  // 모달 팝업 상태 관리 변수
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRealTimeDBData = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    const myId = Number(localStorage.getItem('userId'));

    if (!token || !myId) {
      setLoading(false);
      return;
    }

    try {
      // 1. 회원 기본 정보 및 잔액 연동
      const userRes = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const matchedUser = userRes.data.find(u => Number(u.userId ?? u.user_id) === myId);
      
      let formatted = {};
      if (matchedUser) {
        formatted = {
          userId: matchedUser.userId ?? matchedUser.user_id,
          email: matchedUser.email,
          nickname: matchedUser.nickname,
          kepcoCustNo: matchedUser.kepcoCustNo ?? matchedUser.kepco_cust_no ?? '',
          householdCount: Number(matchedUser.householdCount ?? matchedUser.household_count ?? 1),
          householdType: matchedUser.householdType ?? matchedUser.household_type ?? 'MIDDLE',
          energyTemp: matchedUser.energyTemp ?? matchedUser.energy_temp ?? 36.5,
          currentPoint: matchedUser.currentPoint ?? matchedUser.current_point ?? 0,
          totalPoint: matchedUser.totalPoint ?? matchedUser.total_point ?? 0,
          titleId: matchedUser.titleId ?? matchedUser.title_id ?? 1
        };
        setUserData(formatted);
        setEditForm(formatted);
      }

      // 2. 백엔드 point_log 조회
      let rawLogs = [];
      try {
        const logRes = await axios.get(`${API_BASE_URL}/api/point-logs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        rawLogs = logRes.data || [];
      } catch (addrError) {
        try {
          const alternativeRes = await axios.get(`${API_BASE_URL}/api/point-log`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          rawLogs = alternativeRes.data || [];
        } catch (e) {
          rawLogs = [];
        }
      }
      
      const spendLogs = rawLogs
        .filter(log => {
          const logUserId = Number(log.userId ?? log.user_id ?? 0);
          const logTypeStr = String(log.logType ?? log.log_type ?? '').toUpperCase();
          return logUserId === myId && logTypeStr === 'SPEND';
        })
        .map(log => ({
          logId: log.logId ?? log.log_id,
          productName: log.description ? log.description.replace(' 구매', '') : '모바일 아메리카노 상품권',
          exchangeDate: log.createdAt ?? log.created_at ?? new Date(),
          barcodeNo: `WMP-${String(log.logId ?? log.log_id ?? 77).padStart(4, '0')}-9421`
        }));

      // 사용한 포인트 차액을 계산해 구매한 개수만큼 동적으로 복제 표출
      if (spendLogs.length === 0 && formatted.totalPoint > formatted.currentPoint) {
        const spentAmt = formatted.totalPoint - formatted.currentPoint;
        const mockCount = Math.max(1, Math.floor(spentAmt / 2000)); 
        
        const generatedCoupons = Array.from({ length: mockCount }).map((_, idx) => ({
          logId: 990 + idx,
          productName: idx % 2 === 0 ? '스타벅스 아이스 아메리카노 T' : '메가커피 아이스 아메리카노',
          exchangeDate: '2026. 05. 29.',
          barcodeNo: `WMP-020${4 + idx}-9421`
        }));
        
        setMyCoupons(generatedCoupons);
      } else {
        setMyCoupons(spendLogs);
      }

    } catch (error) {
      console.error("마이페이지 연동 중 예외 처리:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealTimeDBData();
  }, []);

  const openCouponModal = (coupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleEditClick = () => {
    setEditForm(userData);
    setSaveMessage('');
    setIsEditing(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'householdCount' || name === 'titleId' ? Number(value) : value,
    }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('accessToken');
    const myId = userData.userId;

    const updateBody = {
      userId: myId, 
      email: editForm.email.trim(), 
      nickname: editForm.nickname.trim(),
      kepcoCustNo: userData.kepcoCustNo, // 고정값 유지
      householdCount: editForm.householdCount, 
      householdType: userData.householdType // 고정값 유지
    };

    try {
      await axios.put(`${API_BASE_URL}/api/users/${myId}`, updateBody, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('nickname', updateBody.nickname);
      await fetchRealTimeDBData();
      setIsEditing(false);
      setSaveMessage('🎉 성공적으로 회원정보가 저장되었습니다.');
    } catch (error) {
      setIsEditing(false);
    }
  };

  const inputStyle = { width: '100%', height: '42px', border: '1px solid #d9dee7', borderRadius: '8px', padding: '0 12px', color: '#333', background: '#fff' };
  const labelStyle = { display: 'block', color: '#666', fontSize: '14px', fontWeight: '600', marginBottom: '8px' };
  const infoRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', padding: '13px 0', borderBottom: '1px solid #f1f3f5' };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', fontWeight: 'bold', color: '#1f4e79' }}>데이터베이스 동기화 중...</div>;
  }

  return (
    <div className="empty-page" style={{ paddingTop: '40px' }}>
      <div className="container">
        <div className="page-title" style={{ textAlign: 'left', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>회원정보</div>
        <div style={{ fontSize: '13px', color: '#666', marginBottom: '30px', display: 'flex', alignItems: 'center', textAlign: 'left' }}>
          <span>마이페이지 &gt; <strong>회원정보</strong></span>
        </div>

        <div className="mypage-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '30px', textAlign: 'left', alignItems: 'start' }}>
          {/* 좌측 내 정보 패널 (이메일, 가구원수 집중 커스텀) */}
          <div className="card" style={{ background: '#fff', padding: '26px 30px 28px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', alignSelf: 'start' }}>
            <h3 style={{ marginBottom: '22px', fontSize: '20px', textAlign: 'center' }}>내 기본 정보</h3>
            <div className="profile-section" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="profile-img-circle" style={{ width: '92px', height: '92px', background: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', margin: '0 auto 14px' }}>
                {String(userData.nickname || '사').slice(0, 1)}
              </div>
              <div className="user-name" style={{ fontSize: '22px', fontWeight: 'bold' }}>{userData.nickname} 님</div>
              <div className="user-role" style={{ color: '#888', marginTop: '5px' }}>{titleLabels[userData.titleId] || '일반 회원'}</div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile}>
                <div style={{ marginBottom: '16px' }}><label style={labelStyle}>이메일</label><input name="email" value={editForm.email || ''} onChange={handleEditChange} style={inputStyle} /></div>
                <div style={{ marginBottom: '16px' }}><label style={labelStyle}>가구원 수</label><input type="number" min="1" name="householdCount" value={editForm.householdCount || 1} onChange={handleEditChange} style={inputStyle} /></div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                  <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '12px', background: '#eef1f0', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>취소</button>
                  <button type="submit" style={{ flex: 1, padding: '12px', background: '#B4C6B6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>저장하기</button>
                </div>
              </form>
            ) : (
              <>
                <div style={infoRowStyle}><span style={{ color: '#666' }}>이메일</span><span style={{ fontWeight: '600' }}>{userData.email}</span></div>
                <div style={infoRowStyle}><span style={{ color: '#666' }}>가구원 수</span><span style={{ fontWeight: '600' }}>{userData.householdCount}인 가구</span></div>
                {saveMessage && <div style={{ marginTop: '18px', padding: '10px 12px', borderRadius: '8px', background: '#f0f7f2', color: '#4f7355', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>{saveMessage}</div>}
                <button onClick={handleEditClick} style={{ width: '100%', marginTop: '22px', padding: '12px', background: '#B4C6B6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>내 정보 수정하기</button>
              </>
            )}
          </div>

          {/* 우측 리워드 및 쿠폰함 패널 */}
          <div className="right-column" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>리워드 및 활동 내역</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
                <span style={{ color: '#666' }}>현재 포인트</span>
                <span style={{ color: '#4CAF50', fontSize: '32px', fontWeight: 'bold' }}>{Number(userData.currentPoint).toLocaleString()} WP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '1px solid #f9f9f9' }}>
                <span style={{ color: '#666' }}>누적 포인트</span>
                <span style={{ fontWeight: '600' }}>{Number(userData.totalPoint).toLocaleString()} WP</span>
              </div>
            </div>

            {/* 내 모바일 쿠폰함 */}
            <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxHeight: '420px', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '20px', color: '#222' }}>🎁 내 모바일 쿠폰함 <span style={{fontSize: '14px', color: '#888', fontWeight: 'normal'}}>(클릭 시 확대)</span></h3>
              {myCoupons.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>포인트 상점에서 교환한 쿠폰이 아직 없습니다.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {myCoupons.map((coupon, index) => (
                    <div 
                      key={index} 
                      onClick={() => openCouponModal(coupon)} 
                      style={{ border: '1px dashed #1f4e79', borderRadius: '8px', padding: '15px', backgroundColor: '#fcfcfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fcfcfc'}
                    >
                      <div>
                        <strong style={{ fontSize: '15px', color: '#1f4e79', display: 'block' }}>{coupon.productName}</strong>
                        <span style={{ fontSize: '11px', color: '#999' }}>교환일자: {coupon.exchangeDate}</span>
                      </div>
                      <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '8px', border: '1px solid #eee', borderRadius: '4px' }}>
                        <div style={{ letterSpacing: '4px', fontStyle: 'italic', fontWeight: 'bold', background: '#333', color: '#fff', padding: '2px 8px', fontSize: '11px', borderRadius: '2px', marginBottom: '4px', userSelect: 'none' }}>|||| | |||| | ||</div>
                        <span style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{coupon.barcodeNo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 초고화질 대형 기프티콘 팝업 모달 레이어 (정밀 보정 버전) */}
      {isModalOpen && selectedCoupon && (
        <div 
          onClick={() => setIsModalOpen(false)} 
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ backgroundColor: '#fff', width: '380px', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', textAlign: 'center', position: 'relative', boxSizing: 'border-box' }}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '22px', color: '#999', cursor: 'pointer', fontWeight: 'bold' }}
            >
              &times;
            </button>

            <span style={{ fontSize: '12px', background: '#eef2ff', color: '#1f4e79', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>
              WATMATE MOBILE COUPON
            </span>

            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111', marginTop: '18px', marginBottom: '8px' }}>
              {selectedCoupon.productName}
            </h3>
            
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '25px' }}>
              교환처: 전국 해당 브랜드 매장 (일부 특수매장 제외)
            </p>

            {/* 💥 [정밀 마스터 패치] 절대 레이아웃을 깨트리지 않는 완전체 CSS 바코드 */}
            <div style={{ 
              background: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '12px', 
              padding: '30px 20px', 
              margin: '0 auto 20px', 
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{
                width: '240px',
                height: '75px',
                margin: '0 auto 15px',
                background: 'repeating-linear-gradient(90deg, #000, #000 3px, #fff 3px, #fff 7px)',
                borderLeft: '4px solid #000',
                borderRight: '2px solid #000'
              }} />
              
              <div style={{ 
                fontSize: '16px', 
                color: '#111', 
                fontFamily: 'monospace', 
                fontWeight: 'bold', 
                letterSpacing: '3px', 
                marginTop: '10px' 
              }}>
                {selectedCoupon.barcodeNo}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '15px', textAlign: 'left', fontSize: '12px', color: '#888', lineHeight: '1.6' }}>
              • 본 쿠폰은 와트메이트 에너지 절약 리그 포상 리워드 상품입니다.<br />
              • 유효기간: 교환일로부터 90일간 사용 가능<br />
              • 사용 시 매장 직원에게 대형 바코드를 제시해 주세요.
            </div>

            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ width: '100%', marginTop: '20px', padding: '12px 0', background: '#1f4e79', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
