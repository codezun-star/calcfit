import { useState, useEffect } from 'react';

interface HistoryEntry {
  date:  string;
  value: number;
}

export function useHistory(key: string, maxItems = 5) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(key);
    if (stored) {
      try { setHistory(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, [key]);

  const addEntry = (value: number) => {
    const entry: HistoryEntry = {
      date:  new Date().toLocaleDateString('es'),
      value,
    };
    const updated = [entry, ...history].slice(0, maxItems);
    setHistory(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(updated));
    }
  };

  const clear = () => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  };

  return { history, addEntry, clear };
}
