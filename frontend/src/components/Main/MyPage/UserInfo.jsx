import React, { useEffect, useState } from 'react';

const memberTable = [
  { userId: 2, email: 'soung6076@naver.com', nickname: '김성진', kepcoCustNo: '0000000000', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
  { userId: 8, email: 'geonyang1103@naver.com', nickname: '이건양', kepcoCustNo: '20212593', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
  { userId: 9, email: 'rkdalsgh10@naver.com', nickname: '김성준', kepcoCustNo: '1234567890', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
  { userId: 10, email: 'wodyddl09166@naver.com', nickname: '박재용', kepcoCustNo: '0342464719', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
  { userId: 11, email: 'geonyang@naver.com', nickname: '건양', kepcoCustNo: '0189325078', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
  { userId: 12, email: 'user9@naver.com', nickname: 'user9', kepcoCustNo: '0000000009', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
  { userId: 13, email: 'user17@naver.com', nickname: '날렵한또치', kepcoCustNo: '126398562', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
  { userId: 14, email: 'user13@naver.com', nickname: 'user13', kepcoCustNo: '9845215445', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
  { userId: 15, email: 'user18@naver.com', nickname: 'user18', kepcoCustNo: '5468452584', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
  { userId: 16, email: 'user10@naver.com', nickname: 'user10', kepcoCustNo: '0000000010', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
  { userId: 17, email: 'user11@naver.com', nickname: 'user11', kepcoCustNo: '0000000011', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
  { userId: 18, email: 'user12@naver.com', nickname: 'user12', kepcoCustNo: '0000000012', householdCount: 1, energyTemp: 36.5, currentPoint: 0, totalPoint: 0, titleId: 1, householdType: 'HEAVY' },
];

const householdTypeLabels = {
  HEAVY: '다사용 가구',
  NORMAL: '일반 가구',
  LIGHT: '절약 가구',
};

const titleLabels = {
  1: '일반 회원',
  2: '우수 회원',
  3: '절약 리더',
};

const storageKey = (userId) => `wattmate-user-profile-${userId || 'guest'}`;

const getHouseholdCountLabel = (count) => `${count}인 가구`;

const getCurrentMember = () => {
  const userId = Number(localStorage.getItem('userId'));
  const nickname = localStorage.getItem('nickname');
  const savedProfile = localStorage.getItem(storageKey(userId));

  if (savedProfile) {
    try {
      return JSON.parse(savedProfile);
    } catch (error) {
      console.error('저장된 회원정보를 읽지 못했습니다:', error);
    }
  }

  const matchedMember = memberTable.find((member) => member.userId === userId);

  if (matchedMember) {
    return matchedMember;
  }

  const matchedByNickname = memberTable.find((member) => member.nickname === nickname);

  return matchedByNickname || memberTable[0];
};

const UserInfo = () => {
  const [userData, setUserData] = useState(getCurrentMember);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(getCurrentMember);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const currentMember = getCurrentMember();
    setUserData(currentMember);
    setEditForm(currentMember);
  }, []);

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

  const handleCancelEdit = () => {
    setEditForm(userData);
    setSaveMessage('');
    setIsEditing(false);
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();

    const nextUserData = {
      ...userData,
      nickname: editForm.nickname.trim() || userData.nickname,
      email: editForm.email.trim() || userData.email,
      kepcoCustNo: editForm.kepcoCustNo.trim() || userData.kepcoCustNo,
      householdCount: editForm.householdCount,
      householdType: editForm.householdType,
      titleId: editForm.titleId,
    };

    localStorage.setItem(storageKey(nextUserData.userId), JSON.stringify(nextUserData));
    localStorage.setItem('nickname', nextUserData.nickname);

    setUserData(nextUserData);
    setEditForm(nextUserData);
    setIsEditing(false);
    setSaveMessage('내 회원정보가 업데이트되었습니다.');
  };

  const inputStyle = {
    width: '100%',
    height: '42px',
    border: '1px solid #d9dee7',
    borderRadius: '8px',
    padding: '0 12px',
    color: '#333',
    background: '#fff',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    color: '#666',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
  };

  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    padding: '15px 0',
    borderBottom: '1px solid #f1f3f5'
  };

  return (
    <div className="empty-page" style={{ paddingTop: '40px' }}>
      <div className="container">
        <div className="page-title" style={{ textAlign: 'left', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>
          마이페이지
        </div>

        <div style={{ fontSize: '13px', color: '#666', marginBottom: '30px', display: 'flex', alignItems: 'center', textAlign: 'left' }}>
          <span>마이페이지 &gt; <strong>회원정보</strong></span>
        </div>

        <div className="mypage-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '30px', textAlign: 'left' }}>
          <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', fontSize: '20px' }}>내 기본 정보</h3>
            <div className="profile-section" style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div className="profile-img-circle" style={{ width: '100px', height: '100px', background: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '46px', margin: '0 auto 15px' }}>
                {String(userData.nickname || '사').slice(0, 1)}
              </div>
              <div className="user-name" style={{ fontSize: '22px', fontWeight: 'bold' }}>{userData.nickname} 님</div>
              <div className="user-role" style={{ color: '#888', marginTop: '5px' }}>{titleLabels[userData.titleId] || '일반 회원'}</div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle} htmlFor="profile-nickname">닉네임</label>
                  <input id="profile-nickname" name="nickname" value={editForm.nickname} onChange={handleEditChange} style={inputStyle} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle} htmlFor="profile-email">이메일</label>
                  <input id="profile-email" name="email" value={editForm.email} onChange={handleEditChange} style={inputStyle} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle} htmlFor="profile-kepco">한전 고객번호</label>
                  <input id="profile-kepco" name="kepcoCustNo" value={editForm.kepcoCustNo} onChange={handleEditChange} style={inputStyle} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle} htmlFor="profile-household-count">가구원 수</label>
                  <select id="profile-household-count" name="householdCount" value={editForm.householdCount} onChange={handleEditChange} style={inputStyle}>
                    <option value={1}>1인 가구</option>
                    <option value={2}>2인 가구</option>
                    <option value={3}>3인 가구</option>
                    <option value={4}>4인 이상 가구</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle} htmlFor="profile-household-type">가구 유형</label>
                  <select id="profile-household-type" name="householdType" value={editForm.householdType} onChange={handleEditChange} style={inputStyle}>
                    <option value="HEAVY">다사용 가구</option>
                    <option value="NORMAL">일반 가구</option>
                    <option value="LIGHT">절약 가구</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={handleCancelEdit} style={{ flex: 1, padding: '12px', background: '#eef1f0', border: 'none', borderRadius: '8px', color: '#45524a', fontWeight: 'bold', cursor: 'pointer' }}>
                    취소
                  </button>
                  <button type="submit" style={{ flex: 1, padding: '12px', background: '#B4C6B6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                    저장하기
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div style={infoRowStyle}>
                  <span style={{ color: '#666' }}>회원번호</span>
                  <span style={{ fontWeight: '600' }}>{userData.userId}</span>
                </div>
                <div style={infoRowStyle}>
                  <span style={{ color: '#666' }}>이메일</span>
                  <span style={{ fontWeight: '600' }}>{userData.email}</span>
                </div>
                <div style={infoRowStyle}>
                  <span style={{ color: '#666' }}>한전 고객번호</span>
                  <span style={{ fontWeight: '600' }}>{userData.kepcoCustNo}</span>
                </div>
                <div style={infoRowStyle}>
                  <span style={{ color: '#666' }}>가구원 수</span>
                  <span style={{ fontWeight: '600' }}>{getHouseholdCountLabel(userData.householdCount)}</span>
                </div>
                <div style={infoRowStyle}>
                  <span style={{ color: '#666' }}>가구 유형</span>
                  <span style={{ fontWeight: '600' }}>{householdTypeLabels[userData.householdType] || userData.householdType}</span>
                </div>

                {saveMessage && (
                  <div style={{ marginTop: '18px', padding: '10px 12px', borderRadius: '8px', background: '#f0f7f2', color: '#4f7355', fontSize: '14px', fontWeight: '700' }}>
                    {saveMessage}
                  </div>
                )}

                <button onClick={handleEditClick} style={{ width: '100%', marginTop: '25px', padding: '12px', background: '#B4C6B6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                  내 정보 수정하기
                </button>
              </>
            )}
          </div>

          <div className="right-column" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>리워드 및 활동 내역</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
                <span style={{ color: '#666' }}>현재 포인트</span>
                <span style={{ color: '#4CAF50', fontSize: '32px', fontWeight: 'bold' }}>
                  {userData.currentPoint.toLocaleString()} P
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '1px solid #f9f9f9' }}>
                <span style={{ color: '#666' }}>누적 포인트</span>
                <span style={{ fontWeight: '600' }}>{userData.totalPoint.toLocaleString()} P</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
                <span style={{ color: '#666' }}>에너지 온도</span>
                <span style={{ color: '#d9534f', fontWeight: 'bold' }}>{userData.energyTemp}°C</span>
              </div>
            </div>

            <div className="card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>계정 보안</h3>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                로그인된 회원번호: {userData.userId}
              </p>
              <button style={{ padding: '10px 20px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
