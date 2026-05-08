import React, { useState } from 'react';
import '../css/SignUpForm.css';
import SignUpFormIntro from '../components/signup/SignUpFormIntro';
import SignUpFormCard from '../components/signup/SignUpFormCard';

export default function SignUpForm({ onNavigate }) {
<<<<<<< HEAD

=======
  // 1. 폼 상태 관리
>>>>>>> b4d3830969fa17d2913c8ec95249291cdb1d25fd
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

<<<<<<< HEAD
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

=======
  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
>>>>>>> b4d3830969fa17d2913c8ec95249291cdb1d25fd
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

<<<<<<< HEAD
  const handleCheckDuplicate = () => {
=======
  // 2. 아이디 중복 확인 API 연동 (친구의 고정 IP 서버 사용)
  const handleCheckDuplicate = async () => {
>>>>>>> b4d3830969fa17d2913c8ec95249291cdb1d25fd
    if (!form.username.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }
<<<<<<< HEAD
    alert('사용 가능한 아이디입니다.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert('아이디와 비밀번호 입력하세요');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 다릅니다');
      return;
    }

    alert('회원가입 완료!');
    onNavigate('login');
=======

    try {
      const response = await fetch(`http://localhost:8080/api/check-duplicate?username=${form.username}`);
      const data = await response.json();

      if (data.isAvailable) {
        alert('사용 가능한 아이디입니다.');
      } else {
        alert('이미 사용 중인 아이디입니다.');
      }
    } catch (error) {
      console.error('중복 확인 에러:', error);
      alert('서버 연결에 실패했습니다. (백엔드 서버가 켜져 있는지 확인하세요)');
    }
  };

  // 3. 회원가입 제출 API 연동 (친구의 고정 IP 서버 사용)
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      // 파일 업로드가 포함되어 있으므로 FormData 사용
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('username', form.username);
      formData.append('password', form.password);
      formData.append('region', form.region);
      formData.append('houseType', form.houseType);
      
      if (form.houseProofFile) {
        formData.append('file', form.houseProofFile); // 백엔드에서 받는 이름이 'file'인지 확인 필요
      }

      const response = await fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        body: formData, 
        // 주의: FormData를 보낼 때는 headers에 Content-Type을 직접 쓰지 않습니다.
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다!');
        onNavigate('login');
      } else {
        const errorData = await response.json();
        alert(`가입 실패: ${errorData.message || '서버 오류'}`);
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert('백엔드 서버와 통신할 수 없습니다. (CORS 에러일 가능성이 높아요)');
    }
>>>>>>> b4d3830969fa17d2913c8ec95249291cdb1d25fd
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
<<<<<<< HEAD
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

=======
            setForm((prev) => ({ ...prev, region }));
          }}
          onChangeLocation={({ lat, lon, region }) => {
            setForm((prev) => ({ ...prev, lat, lon, region }));
          }}
        />
>>>>>>> b4d3830969fa17d2913c8ec95249291cdb1d25fd
      </div>
    </div>
  );
}
