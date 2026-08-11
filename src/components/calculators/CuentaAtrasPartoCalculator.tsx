import { useState } from 'react';
import Button from '../ui/Button';
import { calcularCuentaAtrasParto } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function CuentaAtrasPartoCalculator() {
  const [fecha, setFecha] = useState('');
  const [res, setRes]   = useState<ReturnType<typeof calcularCuentaAtrasParto> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    if (!fecha) { setError('Selecciona tu fecha probable de parto'); return; }
    setError('');
    setRes(calcularCuentaAtrasParto(fecha));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Fecha probable de parto</div>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', maxWidth: '240px', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '15px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' }} />
      </div>
      <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '-12px' }}>
        ¿No la conoces? Calcúlala con la calculadora de <a href="/fecha-parto" style={{ color: 'var(--ink)' }}>fecha de parto</a>.
      </p>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular cuenta atrás</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Días para el parto</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '80px', color: 'var(--acid)', lineHeight: 1 }}>{Math.max(0, res.diasRestantes)}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>≈ {res.semanasTexto} restantes · {res.porcentaje}% completado</div>
          </div>
          <div style={{ height: '8px', background: 'var(--border)', marginBottom: '1px' }}>
            <div style={{ height: '8px', width: `${res.porcentaje}%`, background: 'var(--acid)' }} />
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{res.mensaje}</p>
          </div>
          <ShareButtons text={`¡Faltan ${Math.max(0, res.diasRestantes)} días para conocer a mi bebé! Calcula tu cuenta atrás en CalcFit:`} url="https://www.calcfit.com/cuenta-atras-parto" />
        </div>
      )}
    </div>
  );
}
