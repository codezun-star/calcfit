import { useState } from 'react';
import Button from '../ui/Button';
import { calcularDiaDelAnio } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function DiaDelAnioCalculator() {
  const hoy = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha] = useState(hoy);
  const [res, setRes]     = useState<ReturnType<typeof calcularDiaDelAnio> | null>(null);

  function calcular() {
    if (!fecha) return;
    setRes(calcularDiaDelAnio(fecha));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Fecha</div>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', maxWidth: '240px', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '15px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' }} />
      </div>
      <Button onClick={calcular}>Calcular día del año</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Día del año</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{res.diaDelAnio}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>de {res.totalDias} días</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Faltan</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'white', lineHeight: 1 }}>{res.diasRestantes}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>días · {res.porcentaje}% transcurrido</div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              {res.esBisiesto ? 'Es un año bisiesto (366 días).' : 'No es un año bisiesto (365 días).'}
            </p>
          </div>
          <ShareButtons text={`Es el día ${res.diaDelAnio} del año (${res.porcentaje}% transcurrido). Calcúlalo en CalcFit:`} url="https://www.calcfit.com/dia-del-anio" />
        </div>
      )}
    </div>
  );
}
