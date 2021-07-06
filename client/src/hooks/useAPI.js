/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAPI = ({ inputUrl, method, data, withCredentials }) => {
  const [url, setUrl] = useState(inputUrl);
  const [statusCode, setStatusCode] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [apiData, setApiData] = useState();
  const lastUpdate = new Date().toLocaleString();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setError(null);
      setLoading(true);

      try {
        const result = await axios({ url, method, data, withCredentials });

        if (isMounted) {
          setStatusCode(result.status);
          setApiData(result.data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.response);
        }
      }

      if (isMounted) setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return [{ statusCode, loading, error, data: apiData, lastUpdate }, setUrl];
};

export default { useAPI };
