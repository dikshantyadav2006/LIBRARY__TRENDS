import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useUserSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const controllerRef = useRef(null); // 👈 abort controller ref
  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      // 🔥 Abort previous request if exists
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        setLoading(true);

        const res = await axios.get(
          `${api}/admin/bookseat/search?query=${query}`,
          {
            withCredentials: true,
            signal: controller.signal, // 👈 important
          }
        );

        setResults(res.data);
      } catch (err) {
        if (err.name === "CanceledError") {
          // request aborted — ignore silently
          return;
        }
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(delay);
      // cleanup on unmount / query change
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [query]);

  return { results, loading };
};

export default useUserSearch;
