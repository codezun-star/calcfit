import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularLecheBebe } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function LecheBebeCalculator() {
  const [peso, setPeso]   = useState('4');
  const [meses, setMeses] = useState('1');
  const [tomas, setTomas] = useState('8');
  const [res, setRes]     = useState<ReturnType<typeof calcularLecheBebe> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const p = parseFloat(peso), m = parseFloat(meses), t = parseFloat(tomas);
    if (!p || p < 1 || p > 20) { setError('Introduce el peso del bebé (1–20 kg)'); return; }
    if (isNaN(m) || m < 0 || m > 12) { setError('Introduce la edad en meses (0–12)'); return; }
    if (!t || t < 1 || t > 14) { setError('Introduce el número de tomas (1–14)'); return; }
    setError('');
    setRes(calcularLecheBebe(p, m, t));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Peso del bebé" value={peso} onChange={setPeso} suffix="kg" type="number" />
        <Input label="Edad" value={meses} onChange={setMeses} suffix="meses" type="number" />
      </div>
      <div style={{ maxWidth: '180px' }}>
        <Input label="Tomas al día" value={tomas} onChange={setTomas} suffix="tomas" type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular cantidad de leche</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Por toma</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{res.porTomaMl}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>ml · rango {res.rangoMin}–{res.rangoMax} ml</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Total al día</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'white', lineHeight: 1 }}>{res.totalDiaMl}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>ml en {res.tomas} tomas</div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              Estimación para lactancia artificial basada en ~150 ml/kg/día. La lactancia materna se rige por la demanda del bebé. Ante dudas, consulta a tu pediatra.
            </p>
          </div>
          <ShareButtons text={`Mi bebé necesita unos ${res.porTomaMl} ml por toma (${res.totalDiaMl} ml/día). Calcula el del tuyo en CalcFit:`} url="https://www.calcfit.com/leche-bebe" />
        </div>
      )}
    </div>
  );
}
