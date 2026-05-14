import { useState, useEffect } from 'react';

interface HistoryEntry {
  date: string;
  value: number;
}

interface HistoryTableProps {
  storageKey: string;
  unit: string;
}

export default function HistoryTable({ storageKey, unit }: HistoryTableProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try { setHistory(JSON.parse(stored)); } catch { setHistory([]); }
    }
  }, [storageKey]);

  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  };

  if (history.length === 0) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
        Historial
      </span>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', fontWeight: 400, padding: '6px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Fecha</th>
            <th style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', fontWeight: 400, padding: '6px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)', padding: '8px 0' }}>{entry.date}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--ink)', padding: '8px 0' }}>
                {entry.value} <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{unit}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={clearHistory}
          style={{ fontFamily: 'var(--font-body)', fontSize: '11px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '5px 12px', cursor: 'pointer' }}
        >
          Borrar historial
        </button>
      </div>
    </div>
  );
}
