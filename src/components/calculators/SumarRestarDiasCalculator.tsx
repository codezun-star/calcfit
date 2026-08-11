import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularFechaDesplazada } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function SumarRestarDiasCalculator() {
  const hoy = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha]   = useState(hoy);
  const [op, setOp]         = useState<'sumar' | 'restar'>('sumar');
  const [dias, setDias]     = useState('');
  const [meses, setMeses]   = useState('');
  const [anios, setAnios]   = useState('');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularFechaDesplazada> | null>(null);
  const [error, setError]   = useState('');

  function calcular() {
    if (!fecha) { setError('Selecciona una fecha base'); return; }
    const d = parseInt(dias) || 0, m = parseInt(meses) || 0, a = parseInt(anios) || 0;
    if (d === 0 && m === 0 && a === 0) { setError('Introduce al menos un valor de días, meses o años'); return; }
    setError('');
    setResultado(calcularFechaDesplazada(fecha, d, m, a, op));
  }

  const btnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '10px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Fecha base</div>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', maxWidth: '220px', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '15px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', gap: '4px', maxWidth: '260px' }}>
        <button onClick={() => setOp('sumar')} style={btnStyle(op === 'sumar')}>Sumar (+)</button>
        <button onClick={() => setOp('restar')} style={btnStyle(op === 'restar')}>Restar (−)</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <Input label="Días" value={dias} onChange={setDias} type="number" />
        <Input label="Meses" value={meses} onChange={setMeses} type="number" />
        <Input label="Años" value={anios} onChange={setAnios} type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular fecha</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Fecha resultante</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: 'var(--acid)', lineHeight: 1, textTransform: 'capitalize' }}>{resultado.diaSemana}</div>
            <div style={{ fontSize: '16px', color: 'white', marginTop: '6px', textTransform: 'capitalize' }}>{resultado.fechaLarga}</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              Son <strong style={{ color: 'var(--ink)' }}>{Math.abs(resultado.diferenciaDias)} días</strong> {op === 'sumar' ? 'después' : 'antes'} de la fecha base. Formato corto: {resultado.fechaResultante}.
            </p>
          </div>
          <ShareButtons text={`La fecha resultante es ${resultado.fechaLarga}. Calcula la tuya en CalcFit:`} url="https://www.calcfit.com/sumar-restar-dias" />
        </div>
      )}
    </div>
  );
}
