import steemConnectAPI from 'utils/steemConnectAPI';
import { sha256 } from 'js-sha256';

export function getToken() {
  return localStorage.getItem('access_token');
}
export function getEncryptedToken() {
  return sha256(localStorage.getItem('access_token'));
}
export function setToken(token) {
  return localStorage.setItem('access_token', token);
}
export function removeToken() {
  return localStorage.removeItem('access_token');
}
export const getLoginURL = () => steemConnectAPI.getLoginURL(window.location.pathname.length > 1 ? window.location.pathname : '');

