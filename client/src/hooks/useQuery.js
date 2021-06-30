import { useState, useEffect } from 'react';

export const useQuery = ({ url }) => {
  const [statusCode, setStatusCode] = useState();
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState();

  useEffect(() => {
    let isMounted = true;
    fetch(url, { credentials: 'include' })
      .then((response) => {
        if (isMounted) setStatusCode(response.status);
        return response.json();
      })
      .then((json) => {
        if (isMounted) setApiData({ ...json });
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [url]);

  return { statusCode, loading, data: apiData };
};

export default { useQuery };
