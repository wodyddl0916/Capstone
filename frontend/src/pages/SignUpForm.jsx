import React, { useEffect, useRef, useState } from 'react';
import '../css/SignUpForm.css';

export default function SignUpForm({ onNavigate }) {
  const mapRef = useRef(null);
  const [showMap, setShowMap] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    region: '',
    lat: '',
    lon: '',
    houseType: '',
    houseVerifyMethod: '',
    houseProofFile: null,
    agree: false,
  });

  useEffect(() => {
    const existingScript = document.getElementById('kakao-map-script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'kakao-map-script';
    script.src =
      '//dapi.kakao.com/v2/maps/sdk.js?appkey=ff65cc948f3f20894a05032f0024e3b3';
    script.async = true;

    document.head.appendChild(script);
  }, []);

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

    alert(`"${form.username}" 는 사용 가능한 아이디입니다.`);
  };

  const showCurrentLocationMap = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setForm((prev) => ({
          ...prev,
          lat,
          lon,
          region: `위도 ${lat.toFixed(5)}, 경도 ${lon.toFixed(5)}`,
        }));

        setShowMap(true);

        setTimeout(() => {
          const mapContainer = mapRef.current;
          if (!mapContainer || !window.kakao) return;

          const mapOption = {
            center: new window.kakao.maps.LatLng(lat, lon),
            level: 3,
          };

          const map = new window.kakao.maps.Map(mapContainer, mapOption);

          const markerPosition = new window.kakao.maps.LatLng(lat, lon);

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });

          marker.setMap(map);
          map.relayout();
          map.setCenter(new window.kakao.maps.LatLng(lat, lon));
        }, 0);
      },
      () => {
        alert('위치 권한을 허용해야 지도를 볼 수 있습니다.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (error) {
        data = {};
      }

      if (response.ok) {
        alert('회원가입이 완료되었습니다!');
        onNavigate('login');
      } else {
        alert(data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signupform-page">
      <div className="signupform-overlay"></div>

      <div className="signupform-container">
        <div className="signupform-left">
          <div className="signupform-badge">WattMate Sign Up</div>

          <h1 className="signupform-title">
            우리 집 에너지 절약의
            <br />
            첫 시작
          </h1>

          <p className="signupform-description">
            지역과 가구 정보를 바탕으로
            <br />
            맞춤형 절감 분석과 리워드를 제공합니다.
          </p>

          <div className="signupform-info-box">
            <div className="signupform-info-item">
              <span className="signupform-info-icon">⚡</span>
              <span>AI 기반 전력 소비 분석</span>
            </div>
            <div className="signupform-info-item">
              <span className="signupform-info-icon">🎁</span>
              <span>절감 성과에 따른 리워드 지급</span>
            </div>
            <div className="signupform-info-item">
              <span className="signupform-info-icon">🏆</span>
              <span>지역별 랭킹 및 명예의 전당</span>
            </div>
          </div>
        </div>

        <div className="signupform-right">
          <form className="signupform-card" onSubmit={handleSubmit}>
            <div className="signupform-card-top">
              <div className="signupform-card-badge">회원가입</div>
              <h2 className="signupform-card-title">정보를 입력해주세요</h2>
              <p className="signupform-card-subtitle">
                와트메이트 서비스를 시작하기 위한 기본 정보입니다.
              </p>
            </div>

            <div className="signupform-grid">
              <div className="signupform-group full">
                <label>이름</label>
                <input
                  type="text"
                  name="name"
                  placeholder="이름을 입력하세요"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="signupform-group full">
                <label>이메일</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="signupform-group full">
                <label>아이디</label>
                <div className="signupform-inline-field">
                  <input
                    type="text"
                    name="username"
                    placeholder="아이디를 입력하세요"
                    value={form.username}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="signupform-check-btn"
                    onClick={handleCheckDuplicate}
                  >
                    중복확인
                  </button>
                </div>
              </div>

              <div className="signupform-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  name="password"
                  placeholder="비밀번호 입력"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="signupform-group">
                <label>비밀번호 확인</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="비밀번호 다시 입력"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="signupform-group full">
                <label>지역</label>
                <button
                  type="button"
                  className="signupform-location-btn"
                  onClick={showCurrentLocationMap}
                >
                  현재 위치로 지도 보기
                </button>

                {showMap && (
                  <div className="signupform-map-box">
                    <div ref={mapRef} className="signupform-map"></div>
                  </div>
                )}

                {form.region && (
                  <p className="signupform-location-text">
                    현재 위치가 확인되었습니다.
                  </p>
                )}
              </div>

              <div className="signupform-group">
                <label>가구 유형</label>
                <select
                  name="houseType"
                  value={form.houseType}
                  onChange={handleChange}
                >
                  <option value="">가구 유형 선택</option>
                  <option value="1인 가구">1인 가구</option>
                  <option value="2인 가구">2인 가구</option>
                  <option value="3인~4인 가구">3인~4인 가구</option>
                  <option value="5인 이상 가구">5인 이상 가구</option>
                </select>
              </div>

              <div className="signupform-group">
                <label>가구 정보 인증 방식</label>
                <select
                  name="houseVerifyMethod"
                  value={form.houseVerifyMethod}
                  onChange={handleChange}
                >
                  <option value="">인증 방식 선택</option>
                  <option value="증빙서류 업로드">증빙서류 업로드</option>
                  <option value="주민등록등본 인증">주민등록등본 인증</option>
                  <option value="공공 마이데이터 연동">공공 마이데이터 연동</option>
                  <option value="한전 고객정보 연동">한전 고객정보 연동</option>
                </select>
              </div>

              <div className="signupform-group full">
                <label>가구 유형 증빙자료</label>
                <input
                  type="file"
                  name="houseProofFile"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleChange}
                />
              </div>
            </div>

            <label className="signupform-agree">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
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
        </div>
      </div>
    </div>
  );
}

//백엔드
//120행 try문법 부분에 백엔드 관련 코드 부분