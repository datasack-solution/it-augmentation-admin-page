import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const isLoggedIn = () => {
  return !!cookies.get('token');
};

export const login = (token: string) => {
  cookies.set('token', token, { path: '/' });
};

export const logout = () => {
  cookies.remove('token', { path: '/' });
};
