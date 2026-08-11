import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularHorasTrabajadas } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function HorasTrabajadasCalculator() {
  const [entrada, setEntrada]   = useState('09:00');
  const [salida, setSalida]     = useState('18:00');
  const [descanso, setDescanso] = useState('60');
  const [res, setRes]           = useState<ReturnType<typeof calcularHorasTrabajadas> | null>(null);
  const [error, setError]       = useState('');

  function calcular() {
    if (!/^\d{1,2}:\d{2}$/.test(entrada) || !/^\d{1,2}:\d{2}$/.test(salida)) { setError('Introduce las horas en formato HH:MM'); return; }
    const d = parseFloat(descanso) || 0;
    if (d < 0 || d > 600) { setError('El descanso debe estar entre 0 y 600 minutos'); return; }
    setError('');
    setRes(calcularHorasTrabajadas(entrada, salida, d));
  }

  const timeStyle: React.CSSProperties = { width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '16px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.3px', marginBottom: '4px' }}>Hora de entrada</div>
          <input type="time" value={entrada} onChange={e => setEntrada(e.target.value)} style={timeStyle} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.3px', marginBottom: '4px' }}>Hora de salida</div>
          <input type="time" value={salida} onChange={e => setSalida(e.target.value)} style={timeStyle} />
        </div>
      </div>
      <div style={{ maxWidth: '200px' }}>
        <Input label="Descanso (comida)" value={descanso} onChange={setDescanso} suffix="min" type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular horas trabajadas</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Tiempo trabajado</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{res.texto}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>{res.horasDecimales} horas decimales · {res.totalMin} min</div>
          </div>
          <ShareButtons text={`Hoy trabajé ${res.texto}. Calcula tus horas en CalcFit:`} url="https://www.calcfit.com/horas-trabajadas" />
        </div>
      )}
    </div>
  );
}
