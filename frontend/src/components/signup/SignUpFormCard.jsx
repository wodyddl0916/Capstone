import React from 'react';
import FormField from './FormField';
import LocationSelector from './LocationSelector';

export default function SignUpFormCard({
  form,
  onChange,
  onCheckDuplicate,
  onSubmit,
  onNavigate,
  onChangeRegion,
  onChangeLocation,
}) {
  return (
    <form className="signupform-card" onSubmit={onSubmit}>
      <div className="signupform-card-top">
        <div className="signupform-card-badge">회원가입</div>
        <h2 className="signupform-card-title">정보를 입력해주세요</h2>
        <p className="signupform-card-subtitle">
          와트메이트 서비스를 시작하기 위한 필수 정보입니다.
        </p>
      </div>

      <div className="signupform-grid">
        {/* 1. 닉네임 (DB: nickname) */}
        <FormField
          label="닉네임"
          name="nickname"
          placeholder="사용하실 이름을 입력하세요"
          value={form.nickname}
          onChange={onChange}
          full
        />

        {/* 2. 이메일 (DB: email) */}
        <FormField
          label="이메일"
          name="email"
          type="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={onChange}
          full
        />

        {/* 3. 한전 고객번호 (DB: kepcoCustNo - 필수!) */}
        <FormField label="한전 고객번호" full>
          <div className="signupform-inline-field">
            <input
              type="text"
              name="kepcoCustNo"
              placeholder="한전 고객번호 10자리를 입력하세요"
              value={form.kepcoCustNo}
              onChange={onChange}
              required
            />
            <button
              type="button"
              className="signupform-check-btn"
              onClick={() => alert('번호 형식을 확인했습니다.')}
            >
              번호확인
            </button>
          </div>
        </FormField>

        {/* 4. 비밀번호 */}
        <FormField
          label="비밀번호"
          name="password"
          type="password"
          placeholder="비밀번호 입력"
          value={form.password}
          onChange={onChange}
        />

        {/* 5. 비밀번호 확인 */}
        <FormField
          label="비밀번호 확인"
          name="confirmPassword"
          type="password"
          placeholder="비밀번호 다시 입력"
          value={form.confirmPassword}
          onChange={onChange}
        />

        {/* 6. 거주 지역 (LocationSelector 유지) */}
        <FormField label="거주 지역" full>
          <LocationSelector
            region={form.region}
            onChangeRegion={onChangeRegion}
            onChangeLocation={onChangeLocation}
          />
        </FormField>

        {/* 7. 가구원 수 (DB: householdCount - 숫자로 매핑) */}
        <FormField label="가구원 수">
          <select
            name="householdCount"
            value={form.householdCount}
            onChange={onChange}
            required
          >
            <option value="1">1인 가구</option>
            <option value="2">2인 가구</option>
            <option value="3">3인 가구</option>
            <option value="4">4인 이상 가구</option>
          </select>
        </FormField>

        {/* 8. 가구 정보 인증 방식 (기존 디자인 유지) */}
        <FormField label="인증 방식">
          <select
            name="houseVerifyMethod"
            value={form.houseVerifyMethod}
            onChange={onChange}
          >
            <option value="customer_no">고객번호 인증</option>
            <option value="document">증빙자료 첨부</option>
          </select>
        </FormField>
      </div>

      <label className="signupform-agree">
        <input
          type="checkbox"
          name="agree"
          checked={form.agree}
          onChange={onChange}
        />
        <span>개인정보 수집 및 서비스 이용약관에 동의합니다.</span>
      </label>

      <div className="signupform-buttons">
        <button
          type="button"
          className="signupform-back-btn"
          onClick={() => onNavigate('login')}
        >
          뒤로가기
        </button>

        <button type="submit" className="signupform-submit-btn">
          가입하기
        </button>
      </div>

      <div className="signupform-login-link">
        이미 계정이 있으신가요?{' '}
        <button type="button" onClick={() => onNavigate('login')}>
          로그인하기
        </button>
      </div>
    </form>
  );
}