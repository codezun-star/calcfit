import { useState } from 'react';
import Button from '../ui/Button';
import { calcularTiempoJuntos } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function TiempoJuntosCalculator() {
  const [fecha, setFecha] = useState('');
  const [res, setRes]     = useState<ReturnType<typeof calcularTiempoJuntos> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    if (!fecha) { setError('Selecciona la fecha de inicio'); return; }
    const [y, m, d] = fecha.split('-').map(Number);
    if (new Date(y, m - 1, d) > new Date()) { setError('La fecha debe ser anterior a hoy'); return; }
    setError('');
    setRes(calcularTiempoJuntos(fecha));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Fecha de inicio</div>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', maxWidth: '240px', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '15px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' }} />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular tiempo juntos</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{res.anios}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>años</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'white', lineHeight: 1 }}>{res.meses}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>meses</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'white', lineHeight: 1 }}>{res.dias}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>días</div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              Son <strong style={{ color: 'var(--ink)' }}>{res.totalDias.toLocaleString('es')} días</strong> ({res.totalHoras.toLocaleString('es')} horas) juntos. Tu próximo aniversario es en {res.diasProximoAniversario} días.
            </p>
          </div>
          <ShareButtons text={`Llevamos ${res.texto} juntos (${res.totalDias} días). Calcula el tuyo en CalcFit:`} url="https://www.calcfit.com/tiempo-juntos" />
        </div>
      )}
    </div>
  );
}
