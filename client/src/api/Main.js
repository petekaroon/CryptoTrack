import axios from 'axios';

// Load Portfolio Page
export async function loadPortfolio() {
  function getCoinGeckoUrl(cryptoList) {
    const baseUrl = 'https://api.coingecko.com/api/v3/simple/price';
    const cryptoListStr = cryptoList.join('%2C');
    return `${baseUrl}?ids=${cryptoListStr}&vs_currencies=usd`;
  }

  const mainApiResponse = await axios('http://localhost:8000/main-api', { withCredentials: true });
  const cryptoList = mainApiResponse.data.map((crypto) => crypto.name.toLowerCase());
  const coinApiResponse = await axios(getCoinGeckoUrl(cryptoList));
  const supportedCryptosResponse = await axios(`http://localhost:8000/main-api/cryptoList/all`, {
    withCredentials: true
  });
  return { mainApiResponse, coinApiResponse, supportedCryptosResponse };
}

// Delete all transactions of the selected crypto asset
export async function deleteCryptoAsset(cryptoId) {
  const response = await axios.delete(`http://localhost:8000/main-api/${cryptoId}`, { withCredentials: true });
  return response;
}

// Load IndividualCrypto Page
export async function loadIndividualCrypto(cryptoId) {
  const mainApiResponse = await axios(`http://localhost:8000/main-api/${cryptoId}`, { withCredentials: true });
  const cryptoQuery = mainApiResponse.data[0].cryptoName.toLowerCase();
  const coinApiResponse = await axios(
    `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoQuery}&vs_currencies=usd`
  );
  return { mainApiResponse, coinApiResponse };
}

// Delete a single transaction
export async function deleteTransaction(transactionId) {
  const response = await axios.delete(`http://localhost:8000/main-api/transactions/${transactionId}`, {
    withCredentials: true
  });
  return response;
}

// Add a new transaction
export async function addTransaction(cryptoId, type, quantity, pricePerCoin, date, total) {
  const response = await axios.post(
    `http://localhost:8000/main-api/transactions`,
    {
      cryptoId,
      type,
      quantity,
      pricePerCoin,
      date,
      total
    },
    { withCredentials: true }
  );

  return response;
}

export default { loadPortfolio, deleteCryptoAsset, loadIndividualCrypto, deleteTransaction, addTransaction };
