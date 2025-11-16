import axios from "axios";
import { useState, useEffect } from "react";

export const useApi = <T>(url: string, deps: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(url);
        setData(res.data ?? null);
      } catch (err: any) {
        setError(err.message || "API fetch error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, deps);

  return { data, loading, error };
};
