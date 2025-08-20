import {
  clearSession,
  fetchSession,
} from '@/redux/features/session/sessionSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface UseSessionOption {
  required?: boolean;
  onUnauthenticated?: () => void;
}

export function useSession(options?: UseSessionOption) {
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector((state: RootState) => {
    return state.session;
  });

  useEffect(() => {
    if (session.status === 'loading' && !session.data) {
      void dispatch(fetchSession());
    }
  }, [dispatch, session.status]);

  useEffect(() => {
    if (
      options?.required &&
      session.status === 'unauthenticated' &&
      options.onUnauthenticated
    ) {
      options.onUnauthenticated();
    }
  }, [session.status, options]);

  const update = async () => {
    await dispatch(fetchSession());
  };

  const signOut = () => {
    dispatch(clearSession());
  };

  return {
    data: session.data,
    status: session.status,
    error: session.error,
    update,
    signOut,
  };
}
