import React from 'react';

export default function GoalCard() {
  return (
    <div className="card" style={{ minHeight: 'auto' }}>
      <h3>나의 에너지 목표 설정</h3>
      <div className="info-row">
        <span className="info-label">이번 달 목표 전력 사용량</span>
        <span className="info-value">150 kWh</span>
      </div>
      <div className="info-row">
        <span className="info-label">예측 대비 절감 목표</span>
        <span className="info-value" style={{ color: '#e53935' }}>-10%</span>
      </div>
      <div className="info-row">
        <span className="info-label">푸시 알림 수신</span>
        <span className="info-value">켜짐</span>
      </div>
      <button className="btn btn-secondary">목표 재설정</button>
    </div>
  );
}