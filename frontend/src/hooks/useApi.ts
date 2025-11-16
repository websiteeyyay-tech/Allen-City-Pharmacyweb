import { useState } from "react";
import api from "../api";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run<T>(fn: () => Promise<T>) {
    setError(null);
    setLoading(true);
    try {
      const res = await fn();
      setLoading(false);
      return res;
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
      setLoading(false);
      throw err;
    }
  }

  return { api, run, loading, error, setError };
}