import React, { useState } from 'react';
import '../css/SignUpForm.css';
import SignUpFormIntro from '../components/signup/SignUpFormIntro';
import SignUpFormCard from '../components/signup/SignUpFormCard';

export default function SignUpForm({ onNavigate }) {
  // 1. 폼 상태 관리 (원래 UI 그대로 유지하기 위해 상태도 전부 남겨둡니다)
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

  // 입력값 변경 핸들러 (그대로 유지)
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

  // 2. 임시 중복 확인 (나중에 백엔드 API 만들면 연결)
  const handleCheckDuplicate = async () => {
    if (!form.username.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }
    // 현재는 API가 없으니 무조건 통과하는 걸로 임시 처리
    alert('사용 가능한 아이디입니다. (임시 통과)');
  };

  // 3. 회원가입 제출 (🌟 여기만 바뀝니다!)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 항목만 검사 (나머지는 화면에 있어도 안 적어도 넘어가게)
    if (!form.username || !form.password) {
      alert('아이디와 비밀번호를 입력하세요');
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
      // 🌟 핵심: 화면에서 뭘 입력했든 상관없이 백엔드에는 ID와 PW만 JSON으로 보냅니다.
      const response = await fetch('http://43.201.202.195:8080/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: form.username,       // 백엔드가 기다리는 'id'
          password: form.password, // 백엔드가 기다리는 'password'
        }),
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다!');
        onNavigate('login');
      } else {
        alert('가입 실패: 서버 오류');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert('백엔드 서버와 통신할 수 없습니다.');
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
            setForm((prev) => ({ ...prev, region }));
          }}
          onChangeLocation={({ lat, lon, region }) => {
            setForm((prev) => ({ ...prev, lat, lon, region }));
          }}
        />
      </div>
    </div>
  );
}
