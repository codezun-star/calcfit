import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularGrasaDiaria } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function GrasaDiariaCalculator() {
  const [calorias, setCalorias] = useState('2000');
  const [res, setRes]     = useState<ReturnType<typeof calcularGrasaDiaria> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const c = parseFloat(calorias);
    if (!c || c < 800 || c > 6000) { setError('Introduce un valor entre 800 y 6000 kcal/día'); return; }
    setError('');
    setRes(calcularGrasaDiaria(c));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '220px' }}>
        <Input label="Calorías diarias" value={calorias} onChange={setCalorias} suffix="kcal" type="number" />
      </div>
      <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '-12px' }}>
        ¿No las conoces? Calcúlalas con la calculadora de <a href="/calorias-diarias" style={{ color: 'var(--ink)' }}>calorías diarias</a>.
      </p>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular grasa diaria</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Grasa recomendada (30%)</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{res.recomendadoG}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>g/día · rango {res.minG}–{res.maxG} g</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              La OMS recomienda que la grasa aporte entre el <strong style={{ color: 'var(--ink)' }}>20% y 35%</strong> de la energía. Las grasas saturadas deben quedar por debajo de <strong style={{ color: 'var(--ink)' }}>{res.saturadasMaxG} g</strong> (10% de las calorías).
            </p>
          </div>
          <ShareButtons text={`Mi grasa diaria recomendada es ${res.recomendadoG} g (rango ${res.minG}–${res.maxG} g). Calcula la tuya en CalcFit:`} url="https://www.calcfit.com/grasa-diaria" />
        </div>
      )}
    </div>
  );
}
