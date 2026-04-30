import React from 'react';
import '../css/SignUp.css';

export default function SignUp({ onNavigate }) {
  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* 왼쪽 소개 영역 */}
        <div className="signup-left">
          <div className="signup-brand">
            <div className="signup-logo">
              <div className="signup-logo-diamond"></div>
              <div className="signup-logo-bolt"></div>
            </div>

            <div>
              <div className="signup-brand-subtitle">에너지가 가치가 되는 순간</div>
              <div className="signup-brand-title">와트메이트</div>
            </div>
          </div>

          <div className="signup-main-title">
            우리 동네에서 시작하는
            <br />
            에너지 절약 습관
          </div>

          <div className="signup-description">
            AI 기반 에너지 절감 리워드 서비스로
            <br />
            전력 사용을 똑똑하게 관리하고, 절감한 만큼 보상까지 받아보세요.
          </div>

          <div className="signup-feature-list">
            <div className="signup-feature-card">
              <div className="signup-feature-label">실시간 분석</div>
              <div className="signup-feature-title">전력 사용량 확인</div>
            </div>

            <div className="signup-feature-card">
              <div className="signup-feature-label">맞춤 가이드</div>
              <div className="signup-feature-title">AI 절약 팁 제공</div>
            </div>

            <div className="signup-feature-card">
              <div className="signup-feature-label">리워드 시스템</div>
              <div className="signup-feature-title">절감 포인트 적립</div>
            </div>
          </div>
        </div>

        {/* 오른쪽 카드 */}
        <div className="signup-card">
          <div className="signup-card-badge">회원가입 안내</div>

          <div className="signup-card-title">
            와트메이트와 함께 에너지 절약을 시작해보세요
          </div>

          <div className="signup-card-description">
            회원가입 후 우리 집 전력 사용량을 확인하고, AI 분석과 절감 리워드를 받아볼 수 있어요.
          </div>

          <div className="signup-info-box">
            <div className="signup-info-title">회원가입 후 입력하는 정보</div>
            <div className="signup-info-text">
              · 이름 / 이메일 / 휴대폰 번호
              <br />
              · 거주 지역 정보
              <br />
              · 가구 유형 및 가구원 수
            </div>
          </div>

          <button
            className="signup-submit-btn"
            onClick={() => onNavigate('signupform')}
          >
            회원가입
          </button>

          <div className="signup-login-text">
            이미 계정이 있나요?
            <button
              onClick={() => onNavigate('login')}
              className="signup-login-btn"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}