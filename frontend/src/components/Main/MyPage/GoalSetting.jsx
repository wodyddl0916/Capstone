import React from 'react';

const GoalSetting = () => {
  return (
    <div className="empty-page">
      <h2>목표 설정</h2>
      <p>이번 달 전기 요금 절약 목표를 설정해보세요!</p>
      
      <div className="page-placeholder">
        <h3>🎯 이번 달 절약 목표</h3>
        <p style={{ color: '#666' }}>여기에 목표 전력량 입력 및 게이지 UI가 들어갑니다.</p>
      </div>
    </div>
  );
};

export default GoalSetting;