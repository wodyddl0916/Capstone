import React, { useState } from 'react';
import '../css/SignUpForm.css';
import SignUpFormIntro from '../components/signup/SignUpFormIntro';
import SignUpFormCard from '../components/signup/SignUpFormCard';

export default function SignUpForm({ onNavigate }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    region: '',
    houseType: '',
    houseVerifyMethod: '',
    houseProofFile: null,
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'file'
          ? files[0]
          : value,
    }));
  };

  const handleCheckDuplicate = () => {
    if (!form.username.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }

    // 아직 백엔드에 중복확인 API가 없다면 일단 임시 처리
    alert('사용 가능한 아이디입니다.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert('아이디와 비밀번호를 입력하세요.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 다릅니다.');
      return;
    }

    if (!form.agree) {
      alert('약관에 동의해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        // 백엔드 SignupRequest.java의 변수명과 맞춰야 함
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password,
          region: form.region,
          houseType: form.houseType,
          houseVerifyMethod: form.houseVerifyMethod,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || '회원가입 완료!');
        onNavigate('login');
      } else {
        alert(data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 요청 실패:', error);
      alert('서버 연결에 실패했습니다.');
    }
  };

  return (
    <div className="signupform-page">
      <div className="signupform-container">
        <SignUpFormIntro />

        <SignUpFormCard
          form={form}
          onChange={handleChange}
          onCheckDuplicate={handleCheckDuplicate}
          onSubmit={handleSubmit}
          onNavigate={onNavigate}
          onChangeRegion={(region) => {
            setForm((prev) => ({
              ...prev,
              region,
            }));
          }}
          onChangeLocation={({ lat, lon, region }) => {
            setForm((prev) => ({
              ...prev,
              lat,
              lon,
              region,
            }));
          }}
        />
      </div>
    </div>
  );
}