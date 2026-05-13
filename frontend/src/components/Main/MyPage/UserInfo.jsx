import React from 'react';

const UserInfo = () => {
  return (
    <div className="empty-page">
      <h2>회원정보</h2>
      <p>고객님의 소중한 회원 정보를 관리하는 페이지입니다.</p>
      
      <div className="page-placeholder">
        <h3>👤 내 프로필</h3>
        <p style={{ color: '#666' }}>여기에 이름, 이메일, 주소 수정 폼 등이 들어갑니다.</p>
      </div>
    </div>
  );
};

export default UserInfo;