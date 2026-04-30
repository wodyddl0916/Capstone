import React from 'react';

export default function ProfileCard() {
  return (
    <div className="card">
      <h3>기본 프로필</h3>
      <div className="profile-section">
        <div className="profile-img-circle">👤</div>
        <div className="user-name">OOO</div>
        <div className="user-role">일반 회원</div>
      </div>
      <div className="info-row">
        <span className="info-label">거주 지역</span>
        <span className="info-value">광주광역시</span>
      </div>
      <div className="info-row">
        <span className="info-label">주거 형태</span>
        <span className="info-value">1인 가구</span>
      </div>
      <button className="btn">프로필 수정하기</button>
    </div>
  );
}