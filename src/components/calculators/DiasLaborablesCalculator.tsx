import { useState } from 'react';
import Button from '../ui/Button';
import { calcularDiasLaborables } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function DiasLaborablesCalculator() {
  const hoy = new Date().toISOString().slice(0, 10);
  const [inicio, setInicio] = useState(hoy);
  const [fin, setFin]       = useState(hoy);
  const [sabado, setSabado] = useState(false);
  const [res, setRes]       = useState<ReturnType<typeof calcularDiasLaborables> | null>(null);
  const [error, setError]   = useState('');

  function calcular() {
    if (!inicio || !fin) { setError('Selecciona las dos fechas'); return; }
    setError('');
    setRes(calcularDiasLaborables(inicio, fin, sabado));
  }

  const dateStyle: React.CSSProperties = { width: '100%', maxWidth: '220px', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '15px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' };
  const seg = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.5px',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Desde</div>
          <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} style={dateStyle} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Hasta</div>
          <input type="date" value={fin} onChange={e => setFin(e.target.value)} style={dateStyle} />
        </div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>¿Cuentas el sábado como laborable?</div>
        <div style={{ display: 'flex', gap: '4px', maxWidth: '260px' }}>
          <button onClick={() => setSabado(false)} style={seg(!sabado)}>No (L-V)</button>
          <button onClick={() => setSabado(true)} style={seg(sabado)}>Sí (L-S)</button>
        </div>
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular días laborables</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Días laborables</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{res.diasLaborables}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Días totales</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'white', lineHeight: 1 }}>{res.diasTotales}</div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              {res.finDeSemana} días caen en fin de semana. En total son {res.semanas} semanas. El cálculo incluye ambas fechas y no descuenta festivos locales.
            </p>
          </div>
          <ShareButtons text={`Entre esas fechas hay ${res.diasLaborables} días laborables. Calcula los tuyos en CalcFit:`} url="https://www.calcfit.com/dias-laborables" />
        </div>
      )}
    </div>
  );
}
