import React, { useState } from 'react';
import api from '../api/axios'; 
import '../css/SignUpForm.css';
import SignUpFormIntro from '../components/signup/SignUpFormIntro';
import SignUpFormCard from '../components/signup/SignUpFormCard';

export default function SignUpForm({ onNavigate }) {
  // 1. 폼 상태 관리
  const [form, setForm] = useState({
    name: '',           
    email: '',          
    username: '',       // UI에서 입력받는 '아이디'
    password: '',
    confirmPassword: '',
    region: '',         
    houseType: '',      
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

  // 2. 회원가입 제출 로직
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 검증: 이메일주소, 비밀번호, 약관 동의만 확인
    if (!form.email || !form.password) {
      alert('이메일주소와 비밀번호는 필수 입력 항목입니다.');
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
      // 🌟 DB에 저장할 데이터 묶음 (거주 지역 포함 완료!)
      const signupData = {
        // 백엔드 username(이메일 컬럼)이 비어있으면 '아이디@wattmate.com'으로 생성
        username: form.email || `${form.username}@wattmate.com`, 
        
        password: form.password,
        
        // 이름이 비어있으면 입력한 '아이디'를 닉네임으로 사용
        nickname: form.name || form.username, 
        
        // 가구 유형이 비어있으면 기본값 '1인 가구'로 설정 (백엔드 Enum 매핑용)
        houseType: form.houseType || '1인 가구',
        
        // 📍 프론트엔드 상태에 저장된 거주 지역 정보를 백엔드로 전송하도록 추가
        region: form.region 
      };

      // 404 에러 방지를 위해 경로를 /api/signup 으로 수정했습니다.
      const response = await api.post('/api/signup', signupData);

      if (response.status === 200 || response.status === 201) {
        alert(`${signupData.nickname}님, 와트메이트에 오신 것을 환영합니다!`);
        onNavigate('login');
      }
    } catch (error) {
      console.error('회원가입 에러 상세:', error);
      
      // 서버에서 보낸 에러 메시지가 있으면 출력, 없으면 기본 메시지 출력
      const message = error.response?.data?.message || '회원가입 실패: 서버 연결 상태를 확인하세요.';
      alert(message);
    }
  };

  return (
    <div className="signupform-page">
      {/* 배경 디자인 요소 */}
      <div className="signupform-overlay"></div>
      
      <div className="signupform-container">
        {/* 왼쪽: 서비스 소개 섹션 */}
        <div className="signupform-left">
          <SignUpFormIntro />
        </div>

        {/* 오른쪽: 입력 카드 섹션 */}
        <div className="signupform-right">
          <SignUpFormCard
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onNavigate={onNavigate}
            onChangeRegion={(region) => setForm(prev => ({ ...prev, region }))}
            onChangeLocation={({ region }) => setForm(prev => ({ ...prev, region }))}
          />
        </div>
      </div>
    </div>
  );
}