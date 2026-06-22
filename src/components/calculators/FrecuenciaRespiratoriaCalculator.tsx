import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { evaluarFrecuenciaRespiratoria } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function FrecuenciaRespiratoriaCalculator() {
  const [rpm, setRpm]     = useState('16');
  const [edad, setEdad]   = useState('30');
  const [res, setRes]     = useState<ReturnType<typeof evaluarFrecuenciaRespiratoria> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const r = parseFloat(rpm), e = parseFloat(edad);
    if (!r || r < 1 || r > 120) { setError('Introduce una frecuencia válida (1–120 rpm)'); return; }
    if (isNaN(e) || e < 0 || e > 120) { setError('Introduce una edad válida (0–120 años)'); return; }
    setError('');
    setRes(evaluarFrecuenciaRespiratoria(r, e));
  }

  const colores: Record<string, string> = { bradipnea: '#60a5fa', normal: 'var(--acid)', taquipnea: '#f87171' };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Respiraciones por minuto" value={rpm} onChange={setRpm} suffix="rpm" type="number" />
        <Input label="Edad" value={edad} onChange={setEdad} suffix="años" type="number" />
      </div>
      <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '-12px' }}>
        Cuenta cuántas veces sube el pecho en 60 segundos, en reposo.
      </p>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Evaluar frecuencia</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Resultado</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: colores[res.categoria], lineHeight: 1, textTransform: 'capitalize' }}>{res.categoria}</div>
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>Rango normal para la edad: {res.rangoNormal}</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{res.mensaje}</p>
          </div>
          <ShareButtons text={`Mi frecuencia respiratoria es ${rpm} rpm (${res.categoria}). Evalúa la tuya en CalcFit:`} url="https://www.calcfit.com/frecuencia-respiratoria" />
        </div>
      )}
    </div>
  );
}
