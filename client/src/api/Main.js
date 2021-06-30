import axios from 'axios';

export async function loadPage() {
  const response = await axios.get('http://localhost:8000/main-api', { withCredentials: true });
  return response;
}

export default { loadPage };
