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
    if (error.response && error.response.status === 401) {
      const refreshToken = getTokens().refreshToken;

      // refreshToken이 있는 경우
      if (refreshToken) {
        console.log('refreshToken이 있는 경우');
        // refreshToken으로 accessToken 을 받아오는 것에 성공한 경우
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

          const accessToken = res.data.accessToken;

          console.log('token 받기 성공 > ', accessToken);

          setAccessToken(accessToken);

          error.config.headers.Authorization = `Bearer ${accessToken}`;

          return instance(error.config);
        } catch (err) {
          console.log('token 재발급 실패');
          // refreshToken으로 accessToken을 받아오는 것에 실패한 경우
          removeTokens();
          return error;
        }
      } //
      // refreshToken이 없는 경우
      else {
        console.log('refreshToken이 없는 경우');
        removeTokens();
        return error;
      }
    }
  }
);

export default instance;
