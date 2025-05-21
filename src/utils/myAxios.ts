import axios from 'axios';
import { getTokens, removeTokens, setAccessToken } from './tokens';

const instance = axios.create();

instance.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
// instance.defaults.withCredentials = true;

// 요청 보낼 때, accessToken 이 있는 경우 header에 담아 보낸다.
instance.interceptors.request.use(
  (request) => {
    const accessToken = getTokens().accessToken;

    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
  },
  (err) => {}
);

// 응답을 받았을 때, 401 에러인 경우 refreshToken을 이용하여 accessToken을 재발급 받아 다시 요청
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정
      const refreshToken = getTokens().refreshToken;

      if (refreshToken) {
        console.log('refreshToken으로 accessToken 재발급 시도');
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const newAccessToken = res.data.accessToken;
          console.log('새로운 accessToken 발급 성공: ', newAccessToken);
          setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest); // 원래 요청 재시도
        } catch (err) {
          console.log('accessToken 재발급 실패', err);
          removeTokens();
          // window.location.href = '/login'; // 로그인 페이지로 리디렉션 또는 다른 처리
          return Promise.reject(err); // 에러를 reject하여 호출부의 catch에서 처리하도록 함
        }
      } else {
        console.log('refreshToken 없음, 로그인 필요');
        removeTokens();
        // window.location.href = '/login';
        return Promise.reject(error); // 에러를 reject
      }
    }
    // 401 에러가 아니거나, 다른 종류의 오류는 그대로 reject
    return Promise.reject(error);
  }
);

export default instance;
