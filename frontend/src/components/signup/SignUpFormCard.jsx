import React from 'react';
import FormField from './FormField';
import LocationSelector from './LocationSelector';

export default function SignUpFormCard({
  form,
  onChange,
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
          와트메이트 서비스를 시작하기 위한 기본 정보입니다.
        </p>
      </div>

      <div className="signupform-grid">
        <FormField
          label="이름"
          name="name"
          placeholder="이름을 입력하세요"
          value={form.name}
          onChange={onChange}
          full
        />

        <FormField
          label="이메일"
          name="email"
          type="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={onChange}
          full
        />

        <FormField
          label="비밀번호"
          name="password"
          type="password"
          placeholder="비밀번호 입력"
          value={form.password}
          onChange={onChange}
        />

        <FormField
          label="비밀번호 확인"
          name="confirmPassword"
          type="password"
          placeholder="비밀번호 다시 입력"
          value={form.confirmPassword}
          onChange={onChange}
        />

        <FormField label="거주 지역" full>
          <LocationSelector
            region={form.region}
            onChangeRegion={onChangeRegion}
            onChangeLocation={onChangeLocation}
          />
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
          onClick={() => onNavigate('signup')}
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