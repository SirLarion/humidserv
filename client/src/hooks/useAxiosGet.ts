import { useState, useEffect } from 'react';
import axios from 'axios';

import { SERVER_URL } from '../config';

export const useAxiosGet = <T>(endpoint: `/${string}`) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<undefined | string>();

  useEffect(() => {
    axios
      .get(`${SERVER_URL}${endpoint}`)
      .then(({ data }) => {
        setData(data);
      })
      .catch(() => {
        setError('Bliibu blaabu');
      })
      .finally(() => setLoading(false));
  }, [endpoint]);

  return {
    data,
    loading,
    error,
  };
};
