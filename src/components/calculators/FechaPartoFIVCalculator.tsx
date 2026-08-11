import { useState } from 'react';
import Button from '../ui/Button';
import { calcularFechaPartoFIV } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function FechaPartoFIVCalculator() {
  const [fecha, setFecha] = useState('');
  const [dia, setDia]     = useState<3 | 5>(5);
  const [res, setRes]     = useState<ReturnType<typeof calcularFechaPartoFIV> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    if (!fecha) { setError('Selecciona la fecha de la transferencia'); return; }
    setError('');
    setRes(calcularFechaPartoFIV(fecha, dia));
  }

  const seg = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.5px',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Fecha de la transferencia embrionaria</div>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', maxWidth: '240px', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '15px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' }} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Día del embrión transferido</div>
        <div style={{ display: 'flex', gap: '4px', maxWidth: '320px' }}>
          <button onClick={() => setDia(3)} style={seg(dia === 3)}>Día 3</button>
          <button onClick={() => setDia(5)} style={seg(dia === 5)}>Día 5 (blasto)</button>
        </div>
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular fecha de parto</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Fecha probable de parto</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '44px', color: 'var(--acid)', lineHeight: 1.05, textTransform: 'capitalize' }}>{res.fechaPartoLarga}</div>
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>Ahora mismo: {res.semanasActuales} · faltan {Math.max(0, res.diasRestantes)} días</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              En FIV la fecha de concepción se conoce con precisión, así que la FPP es más exacta que con la regla. Se calcula a partir de la transferencia y la edad del embrión (día 3 o blastocisto de día 5).
            </p>
          </div>
          <ShareButtons text={`Mi fecha probable de parto por FIV es el ${res.fechaPartoLarga}. Calcula la tuya en CalcFit:`} url="https://www.calcfit.com/fecha-parto-fiv" />
        </div>
      )}
    </div>
  );
}
