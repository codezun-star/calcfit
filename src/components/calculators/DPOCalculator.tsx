import { useState } from 'react';
import Button from '../ui/Button';
import { calcularDPO } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function DPOCalculator() {
  const [fecha, setFecha] = useState('');
  const [res, setRes]   = useState<ReturnType<typeof calcularDPO> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    if (!fecha) { setError('Selecciona la fecha de tu ovulación'); return; }
    setError('');
    setRes(calcularDPO(fecha));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Fecha de ovulación</div>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', maxWidth: '240px', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '15px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' }} />
      </div>
      <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '-12px' }}>
        ¿No sabes cuándo ovulaste? Estímalo con la calculadora de <a href="/ovulacion" style={{ color: 'var(--ink)' }}>ovulación</a>.
      </p>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular DPO</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Días post ovulación</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '80px', color: 'var(--acid)', lineHeight: 1 }}>{res.dpo}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>{res.fase} · test fiable desde {res.testFiable}</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{res.mensaje}</p>
          </div>
          <ShareButtons text={`Estoy en ${res.dpo} DPO (${res.fase}). Calcula los tuyos en CalcFit:`} url="https://www.calcfit.com/dpo" />
        </div>
      )}
    </div>
  );
}
