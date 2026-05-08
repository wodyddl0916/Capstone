import axios from 'axios';

// 1. 기본 설정
const api = axios.create({
  baseURL: 'http://43.201.202.195:8080', // 백엔드 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터: 모든 요청에 자동으로 토큰을 실어 보냅니다.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; //
  }
  return config;
});

// 3. 응답 인터셉터: 토큰 만료(401) 시 자동으로 재발급을 시도합니다.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러(토큰 만료)가 났고, 재시도한 적이 없다면
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        // 백엔드에 토큰 재발급 요청
        const res = await axios.post('http://43.201.202.195:8080/api/refresh', { refreshToken });
        
        const newAccessToken = res.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken); // 새 토큰 저장

        // 원래 하려던 요청을 새 토큰으로 다시 보냄
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료되었다면 로그아웃 처리
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
