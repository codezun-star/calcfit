import { useState } from 'react';
import Button from '../ui/Button';
import { calcularDiaSemana } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function DiaSemanaCalculator() {
  const [fecha, setFecha] = useState('');
  const [res, setRes]     = useState<ReturnType<typeof calcularDiaSemana> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    if (!fecha) { setError('Selecciona una fecha'); return; }
    setError('');
    setRes(calcularDiaSemana(fecha));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Fecha (pasada o futura)</div>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', maxWidth: '240px', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '15px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' }} />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Ver qué día fue</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Día de la semana</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1, textTransform: 'capitalize' }}>{res.diaSemana}</div>
            <div style={{ fontSize: '13px', color: 'white', marginTop: '6px', textTransform: 'capitalize' }}>{res.fechaLarga}</div>
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Día {res.diaDelAnio} del año · {res.esFinDeSemana ? 'fin de semana' : 'día laborable'}</div>
          </div>
          <ShareButtons text={`Esa fecha cayó en ${res.diaSemana}. Descúbrelo tú en CalcFit:`} url="https://www.calcfit.com/dia-semana" />
        </div>
      )}
    </div>
  );
}
