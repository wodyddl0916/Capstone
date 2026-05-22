import React, { useState } from 'react';
import api from '../api/axios'; 
import '../css/SignUpForm.css';
import SignUpFormIntro from '../components/signup/SignUpFormIntro';
import SignUpFormCard from '../components/signup/SignUpFormCard';

export default function SignUpForm({ onNavigate }) {
  // 1. 폼 상태 관리: Spring Boot DTO 필드명에 맞춤
  const [form, setForm] = useState({
    email: '',          // 로그인용 이메일
    password: '',
    confirmPassword: '',
    nickname: '',       // 사용자 이름
    kepcoCustNo: '',    // 한전 고객번호 (필수 10자리)
<<<<<<< HEAD
    region: '',
    location: null,
    householdCount: 1,  // 가구원 수 (숫자)
    houseVerifyMethod: 'customer_no',
=======
    householdCount: 1,  // 가구원 수 (숫자)
>>>>>>> 9d801cd8bf0c151b2e4677021c727754b609c178
    agree: false,
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleChangeRegion = (region) => {
    setForm((prev) => ({
      ...prev,
      region,
    }));
  };

  const handleChangeLocation = (location) => {
    setForm((prev) => ({
      ...prev,
      location,
    }));
  };

  // 2. 회원가입 제출 로직
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 검증
    if (!form.email || !form.password || !form.kepcoCustNo) {
      alert('이메일, 비밀번호, 한전 고객번호는 필수 항목입니다.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!form.agree) {
      alert('약관에 동의해주세요.');
      return;
    }

    try {
      // Spring Boot SignupRequest DTO 구조와 1:1 매칭
      const signupData = {
        email: form.email,
        password: form.password,
        nickname: form.nickname || form.email.split('@')[0],
        kepcoCustNo: form.kepcoCustNo,
        householdCount: parseInt(form.householdCount), // 반드시 정수로 변환
      };

      const response = await api.post('/api/signup', signupData);

      if (response.status === 200 || response.status === 201) {
        alert(`${signupData.nickname}님, 와트메이트 가입을 환영합니다!`);
        onNavigate('login');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      const message = error.response?.data?.message || '서버 연결에 실패했습니다.';
      alert(message);
    }
  };

  return (
    <div className="signupform-page">
      <div className="signupform-overlay"></div>
      <div className="signupform-container">
        <div className="signupform-left">
          <SignUpFormIntro />
        </div>
        <div className="signupform-right">
          {/* 자식 컴포넌트에 상태와 핸들러 전달 */}
          <SignUpFormCard
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onNavigate={onNavigate}
<<<<<<< HEAD
            onChangeRegion={handleChangeRegion}
            onChangeLocation={handleChangeLocation}
=======
>>>>>>> 9d801cd8bf0c151b2e4677021c727754b609c178
          />
        </div>
      </div>
    </div>
  );
}
