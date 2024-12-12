import { useState, useEffect } from 'react';
import axiosInstance from '../services/api';
import { AxiosError } from 'axios';
const useApi = (url: string, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(url, options);
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url, options]);
    return { data, loading, error };
};
export default useApi;