import axios from 'axios';

export async function loadPortfolio() {
  function getCoinGeckoUrl(cryptoList) {
    const baseUrl = new URL('https://api.coingecko.com/api/v3/simple/price');
    const cryptoListStr = cryptoList.join('%2C');
    return `${baseUrl}?ids=${cryptoListStr}&vs_currencies=usd`;
  }

  const mainApiResponse = await axios.get('http://localhost:8000/main-api', { withCredentials: true });
  const cryptoList = mainApiResponse.data.map((crypto) => crypto.name.toLowerCase());
  const coinApiResponse = await axios(getCoinGeckoUrl(cryptoList));
  return { mainApiResponse, coinApiResponse };
}

export async function deleteCryptoAsset(cryptoId) {
  const response = await axios.delete(`http://localhost:8000/main-api/${cryptoId}`, { withCredentials: true });
  return response;
}

export default { loadPortfolio, deleteCryptoAsset };
