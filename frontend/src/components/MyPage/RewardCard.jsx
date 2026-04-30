import React from 'react';

export default function RewardCard() {
  return (
    <div className="card" style={{ minHeight: 'auto' }}>
      <h3>리워드 및 활동 내역</h3>
      <div className="info-row">
        <span className="info-label">누적 와트 포인트</span>
        <span className="info-value" style={{ color: '#4CAF50', fontSize: '32px' }}>1,500 P</span>
      </div>
      <div className="info-row">
        <span className="info-label">성공한 미션 횟수</span>
        <span className="info-value">총 4회</span>
      </div>
      <div className="info-row">
        <span className="info-label">현재 해당 가구 랭킹 등급</span>
        <span className="info-value" style={{ color: '#FFC107' }}>B등급 (상위 30%)</span>
      </div>
    </div>
  );
}