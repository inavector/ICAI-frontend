import { getCookie, setCookie, removeCookie } from './cookies';
import { refreshToken } from '../services/auth/auth';
import type { ApiError } from '../services/api/client';

export const handle401Error = async (error: ApiError): Promise<boolean> => {
  if (error.status !== 401) {
    return false;
  }

  const refreshTokenValue = getCookie('refreshToken');
  
  if (!refreshTokenValue) {
    clearAuthAndRedirect();
    return true;
  }

  try {
    const response = await refreshToken(refreshTokenValue);
    
    if (response.access) {
      setCookie('accessToken', response.access, 7);
      if (response.refresh) {
        setCookie('refreshToken', response.refresh, 30);
      }
      return true;
    }
  } catch (refreshError) {
    console.error('Token refresh failed:', refreshError);
    clearAuthAndRedirect();
    return true;
  }

  return false;
};

const clearAuthAndRedirect = (): void => {
  removeCookie('accessToken');
  removeCookie('refreshToken');
  removeCookie('user');
  
  const currentPath = window.location.pathname;
  window.location.href = `/login?from=${encodeURIComponent(currentPath)}`;
};

