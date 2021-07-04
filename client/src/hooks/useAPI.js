import { useState, useEffect } from 'react';

export const useAPI = ({ url, method, contentType, credentials, body }) => {
  const [statusCode, setStatusCode] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [apiData, setApiData] = useState();

  useEffect(() => {
    let isMounted = true;
    fetch(url, { method, headers: { 'Content-Type': contentType }, credentials }, body)
      .then((response) => {
        if (response.ok) {
          if (isMounted) setStatusCode(response.status);
          return response.json();
        }
        throw response;
      })
      .then((json) => {
        if (isMounted) setApiData({ ...json });
      })
      .catch((error) => {
        if (isMounted) setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [url, method, contentType, body, credentials]);

  return { statusCode, loading, error, data: apiData };
};

export default { useAPI };
