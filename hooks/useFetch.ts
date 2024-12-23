import { useState } from "react";
import { toast } from "sonner";

const useFetch = <T, E = any>(
  cb: (...args: any[]) => Promise<T>,
  initialState: T | null = null,
  toastErrors: boolean = true
) => {
  const [data, setData] = useState<T | null>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<E | null>(null);

  const func = async (...args: any[]) => {
    let canceled = false;
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      if (!canceled) setData(response);
    } catch (error: any) {
      if (!canceled) {
        setError(error);
        if (toastErrors) {
          toast.error(error?.message || "An unknown error occurred");
        }
      }
    } finally {
      if (!canceled) setLoading(false);
    }

    return () => {
      canceled = true;
    };
  };

  return { data, loading, error, func, setData };
};

export default useFetch;
