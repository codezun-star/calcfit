import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularEdadCorregida } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function EdadCorregidaCalculator() {
  const [fecha, setFecha] = useState('');
  const [semanas, setSemanas] = useState('32');
  const [res, setRes]     = useState<ReturnType<typeof calcularEdadCorregida> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const s = parseFloat(semanas);
    if (!fecha) { setError('Selecciona la fecha de nacimiento'); return; }
    if (!s || s < 22 || s > 42) { setError('Introduce las semanas de gestación al nacer (22–42)'); return; }
    setError('');
    setRes(calcularEdadCorregida(fecha, s));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Fecha de nacimiento</div>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', maxWidth: '240px', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '15px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' }} />
      </div>
      <div style={{ maxWidth: '240px' }}>
        <Input label="Semanas de gestación al nacer" value={semanas} onChange={setSemanas} suffix="sem" type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular edad corregida</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Edad corregida</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '44px', color: 'var(--acid)', lineHeight: 1 }}>{res.corregidaTexto}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Edad cronológica</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '44px', color: 'white', lineHeight: 1 }}>{res.cronologicaTexto}</div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              Tu bebé nació {res.semanasPrematuro} semanas antes de término. {res.mensaje}
            </p>
          </div>
          <ShareButtons text={`La edad corregida de mi bebé prematuro es ${res.corregidaTexto}. Calcúlala en CalcFit:`} url="https://www.calcfit.com/edad-corregida" />
        </div>
      )}
    </div>
  );
}
