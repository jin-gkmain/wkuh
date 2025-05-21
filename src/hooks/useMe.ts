import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import instance from '@/utils/myAxios';
import { getTokens, removeTokens } from '@/utils/tokens';
import { userActions } from '@/store/modules/userSlice';

const useMe = () => {
  const [loading, setLoading] = useState<'ready' | 'pending' | 'completed'>(
    'ready'
  );
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(({ user }) => user);

  useEffect(() => {
    (async () => {
      const { accessToken, refreshToken } = getTokens();
      if (accessToken || refreshToken) {
        try {
          setLoading('pending');
          const res = await instance.post('/user_info');
          // const data: { result: StoredUser[] } = res.data;
          const data: MyResponse<StoredUser> = res.data;
          console.log('useMe > 성공 ', new Date().getTime(), data);
          if (!userInfo && data.result) {
            dispatch(userActions.setUser(data.result[0]));
          }
          setLoading('completed');
        } catch (err) {
          console.log('useMe 실패', err);
          dispatch(userActions.removeUser());
          removeTokens();
          setLoading('completed');
        }
      } else {
        dispatch(userActions.removeUser());
        removeTokens();
        setLoading('completed');
      }
    })();
  }, [dispatch, userInfo]);

  return { userInfo, loading };
};

export default useMe;
