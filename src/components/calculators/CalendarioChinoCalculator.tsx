import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularCalendarioChino } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CalendarioChinoCalculator() {
  const [edad, setEdad] = useState('28');
  const [mes, setMes]   = useState('6');
  const [res, setRes]   = useState<ReturnType<typeof calcularCalendarioChino> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const e = parseFloat(edad);
    if (isNaN(e) || e < 17 || e > 50) { setError('Introduce la edad de la madre (17–50 años)'); return; }
    setError('');
    setRes(calcularCalendarioChino(e, parseInt(mes)));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '220px' }}>
        <Input label="Edad de la madre al concebir" value={edad} onChange={setEdad} suffix="años" type="number" />
      </div>
      <div style={{ maxWidth: '240px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.3px', marginBottom: '4px' }}>Mes de concepción</div>
        <select value={mes} onChange={e => setMes(e.target.value)} style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '16px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' }}>
          {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Predecir el sexo del bebé</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Predicción del calendario chino</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '80px', color: res.prediccion === 'niño' ? '#60a5fa' : '#f9a8d4', lineHeight: 1, textTransform: 'capitalize' }}>{res.prediccion}</div>
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>Edad lunar usada: {res.edadLunar} años</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              El calendario chino del embarazo es una tradición milenaria <strong style={{ color: 'var(--ink)' }}>sin base científica</strong>. Su acierto es estadísticamente el de lanzar una moneda (~50%). Tómalo como un juego: el único método fiable es la ecografía o el test genético.
            </p>
          </div>
          <ShareButtons text={`El calendario chino dice que será ${res.prediccion}. Pruébalo tú en CalcFit:`} url="https://www.calcfit.com/calendario-chino-bebe" />
        </div>
      )}
    </div>
  );
}
