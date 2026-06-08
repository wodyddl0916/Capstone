# Watt Mate

<h3 align="center">AI 기반 전력 사용량 분석 및 에너지 절약 리워드 플랫폼</h3>
<div align="center">
  <img src="./frontend/public/favicon.svg" alt="Watt Mate Logo" width="120" />
</div>

<br />

## 목차

1. [프로젝트 일정](#1-프로젝트-일정)
2. [프로젝트 개요](#2-프로젝트-개요)
3. [서비스 소개](#3-서비스-소개)
4. [주요 기능](#4-주요-기능)
5. [기술 스택](#5-기술-스택)
6. [프로젝트 구조](#6-프로젝트-구조)
7. [실행 방법](#7-실행-방법)
8. [주요 API 연동](#8-주요-api-연동)
9. [주요 화면](#9-주요-화면)
10. [팀 소개](#10-팀-소개)

<br />

## 1. 프로젝트 일정

---

- 기간: 2026년 5월 ~ 2026년 6월
- 목적: 사용자 전력 데이터를 기반으로 사용량을 분석하고, 에너지 절약 행동을 리워드로 연결하는 웹 서비스 구현

<br />

## 2. 프로젝트 개요

---

전기 사용량은 매달 요금 고지서로 확인할 수 있지만, 사용자가 언제 얼마나 전력을 사용했는지, 이전 기간과 비교해 어떤 변화가 있었는지, 앞으로 요금이 얼마나 발생할지 직관적으로 파악하기는 어렵습니다. 특히 가구별 사용 패턴이나 지역 내 절약 수준을 비교하기 어려워 실질적인 절약 행동으로 이어지기 쉽지 않습니다.

Watt Mate는 사용자의 전력 사용 데이터를 시각화하고, AI 예측 및 요금 계산을 통해 전기 사용 현황을 이해하기 쉽게 제공하는 서비스입니다. 또한 지역 리그와 포인트 리워드 시스템을 통해 사용자가 에너지 절약을 지속할 수 있도록 동기를 부여합니다.

<br />

## 3. 서비스 소개

---

Watt Mate는 전력 사용량 관리, 전기요금 예측, 지역 절약 랭킹, 포인트 상점을 하나의 흐름으로 제공하는 에너지 관리 플랫폼입니다.

- 전력 사용 데이터를 업로드하고 시간별, 일별, 월별 통계로 확인
- 현재 사용량을 기반으로 전기요금 및 누진 구간별 예상 요금 조회
- 이전 월 대비 절감량을 기준으로 지역 리그 순위 확인
- 절약 성과에 따라 지급된 Watt Point를 상품으로 교환
- 마이페이지에서 회원 정보, 보유 포인트, 교환 쿠폰 관리

<br />

## 4. 주요 기능

---

### 회원 관리

- 이메일, 비밀번호, 닉네임, 한전 고객번호, 가구원 수 기반 회원가입
- JWT 토큰 기반 로그인 및 인증 요청 처리
- 토큰 만료 시 refresh API를 통한 access token 재발급 처리
- 마이페이지에서 이메일, 가구원 수 등 사용자 정보 확인 및 수정

### 전력 데이터 분석

- CSV 파일 업로드를 통한 전력 데이터 등록
- 시간별 전력 사용량 조회 및 전일, 전월 동일 시간대와 비교
- 일별, 월별 사용량 통계 확인
- Recharts 기반 차트로 사용량 추이 시각화

### 전기요금 예측

- 월별 사용량 기반 전기요금 계산
- 저압/고압 기준 선택에 따른 요금 비교
- 기본요금, 전력량요금, 총 청구 예상액 분리 표시
- 현재 월 사용량을 기준으로 예상 요금 확인

### 지역 리그 및 리워드

- 전체 사용자 월별 사용량을 조회해 지역 절약 리그 순위 계산
- 전월 대비 절감량 기준 랭킹 산정
- 상위 비율에 따른 예상 리워드 표시
- 나의 순위, 절감량, 전체 평균 사용량 확인

### 포인트 상점

- 사용자의 현재 Watt Point 조회
- 상품 목록 조회 및 포인트로 상품 교환
- 보유 포인트 부족, 재고 소진 등 구매 조건 처리
- 교환 내역을 마이페이지 쿠폰 형태로 확인

### 에너지 뉴스 대시보드

- 네이버 뉴스 검색 API를 활용한 에너지 관련 최신 뉴스 배너 제공
- 월간 총 전력, 예상 요금, 보유 리워드 포인트 요약 제공

<br />

## 5. 기술 스택

---

### Frontend

![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.0.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ESM-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-7.15.1-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.16.0-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3.8.1-22B5BF?style=for-the-badge)
![Styled Components](https://img.shields.io/badge/Styled--Components-6.3.12-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white)

### Backend 연동

![REST API](https://img.shields.io/badge/REST_API-Backend_Integration-0052CC?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Multipart](https://img.shields.io/badge/Multipart-CSV_Upload-4A5568?style=for-the-badge)

### Infra / Deploy

![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Frontend_Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9.39.4-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)

<br />

## 6. 프로젝트 구조

---

```text
watt-mate/
├── README.md
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── assets/
    │   ├── components/
    │   │   ├── Main/
    │   │   │   ├── ElectricStats/
    │   │   │   ├── LeagueStats/
    │   │   │   ├── MyPage/
    │   │   │   ├── PointStore/
    │   │   │   ├── ElectricBillEstimator.jsx
    │   │   │   ├── ElectricBillPage.jsx
    │   │   │   ├── ElectricStats.jsx
    │   │   │   └── Home.jsx
    │   │   └── signup/
    │   ├── css/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Main.jsx
    │   │   ├── SignUp.jsx
    │   │   └── SignUpForm.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── Dockerfile
    ├── docker-compose.yml
    ├── package.json
    ├── vercel.json
    └── vite.config.js
```

<br />

## 7. 실행 방법

---

### 사전 요구사항

- Node.js 20 이상 권장
- npm
- Watt Mate 백엔드 API 서버

### 환경 변수

`frontend/.env` 파일에 API 서버 주소를 설정합니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

Vercel 배포 환경에서는 `vercel.json`의 rewrite 설정 또는 배포 환경 변수에 맞춰 API 경로를 연결합니다.

### 로컬 실행

```bash
cd frontend
npm install
npm run dev
```

### 빌드

```bash
cd frontend
npm run build
```

### 미리보기

```bash
cd frontend
npm run preview
```

<br />

## 8. 주요 API 연동

---

| 구분 | Method | Endpoint | 설명 |
| --- | --- | --- | --- |
| 회원가입 | POST | `/api/signup` | 사용자 계정 생성 |
| 로그인 | POST | `/api/login` | 로그인 및 access token 발급 |
| 토큰 갱신 | POST | `/api/refresh` | refresh token 기반 access token 재발급 |
| 사용자 조회 | GET | `/api/users` | 사용자 목록 및 내 정보 조회 |
| 사용자 수정 | PUT | `/api/users/{userId}` | 회원 정보 수정 |
| 시간별 전력 | GET | `/api/power/hourly` | 날짜 기준 시간별 전력 사용량 조회 |
| 월별 전력 | GET | `/api/power/monthly` | 연도 기준 월별 전력 사용량 조회 |
| 전력 업로드 | POST | `/api/power/upload` | CSV 파일 업로드 및 분석 요청 |
| 상품 목록 | GET | `/api/products` | 포인트 상점 상품 조회 |
| 상품 구매 | POST | `/api/products/purchase` | Watt Point 기반 상품 교환 |
| 포인트 로그 | GET | `/api/point-logs` | 포인트 사용 내역 조회 |

<br />

## 9. 주요 화면

---

| 화면 | 설명 |
| --- | --- |
| 회원가입 안내 | 서비스 소개와 회원가입 진입 화면 |
| 회원가입 폼 | 이메일, 비밀번호, 한전 고객번호, 가구원 수 입력 |
| 로그인 | 사용자 인증 및 토큰 저장 |
| 홈 대시보드 | 에너지 뉴스, 월간 총 전력, 예상 요금, 보유 포인트 요약 |
| 전기 사용량 통계 | 시간별, 일별, 월별 사용량 차트 및 비교 데이터 표시 |
| 전기요금 | 누진 요금 기준 월별 요금 계산 및 예상 청구액 확인 |
| 지역 리그 순위 | 전월 대비 절감량 기준 사용자 랭킹 표시 |
| 포인트 상점 | Watt Point로 상품 및 쿠폰 교환 |
| 마이페이지 | 회원 정보, 포인트, 쿠폰 내역 확인 |
| 전력 데이터 업로드 | CSV 업로드 후 전력 데이터 분석 및 저장 |

<br />

## 10. 팀 소개

---

<table>
  <tr>
    <th align="center">이름</th>
    <th align="center">역할</th>
    <th align="center">담당 업무</th>
  </tr>
  <tr>
    <td align="center">업데이트 예정</td>
    <td align="center">Frontend</td>
    <td align="center">React 화면 구현, API 연동, 데이터 시각화</td>
  </tr>
  <tr>
    <td align="center">업데이트 예정</td>
    <td align="center">Backend</td>
    <td align="center">인증, 전력 데이터, 포인트, 상품 API 구현</td>
  </tr>
  <tr>
    <td align="center">업데이트 예정</td>
    <td align="center">AI / Data</td>
    <td align="center">전력 데이터 분석 및 예측 로직 구현</td>
  </tr>
  <tr>
    <td align="center">업데이트 예정</td>
    <td align="center">Infra</td>
    <td align="center">배포 환경 구성 및 운영 관리</td>
  </tr>
</table>
