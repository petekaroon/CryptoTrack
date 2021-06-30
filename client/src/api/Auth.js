import axios from 'axios';

export async function login(username, password) {
  const response = await axios.post(
    'http://localhost:8000/auth-api/login',
    { username, password },
    { withCredentials: true }
  );
  return response;
}

export async function register(username, password) {
  const response = await axios.post(
    'http://localhost:8000/auth-api/register',
    { username, password },
    { withCredentials: true }
  );
  return response;
}

export default { login, register };
