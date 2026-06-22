import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularSuperavitCalorico } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function SuperavitCaloricoCalculator() {
  const [tdee, setTdee]   = useState('2400');
  const [res, setRes]     = useState<ReturnType<typeof calcularSuperavitCalorico> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const t = parseFloat(tdee);
    if (!t || t < 1000 || t > 6000) { setError('Introduce tu gasto (TDEE) entre 1000 y 6000 kcal'); return; }
    setError('');
    setRes(calcularSuperavitCalorico(t));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '240px' }}>
        <Input label="Gasto energético diario (TDEE)" value={tdee} onChange={setTdee} suffix="kcal" type="number" />
      </div>
      <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '-12px' }}>
        ¿No conoces tu TDEE? Calcúlalo con la calculadora de <a href="/calorias-diarias" style={{ color: 'var(--ink)' }}>calorías diarias</a>.
      </p>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular superávit</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          {res.escenarios.map((e, i) => (
            <div key={i} style={{ background: i === 0 ? 'var(--ink)' : 'transparent', border: i === 0 ? 'none' : '1px solid var(--border)', padding: '18px 20px', marginBottom: i === 0 ? '1px' : '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: i === 0 ? '#999' : 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{e.nombre}</div>
                <div style={{ fontSize: '12px', color: i === 0 ? '#aaa' : 'var(--muted)', marginTop: '2px' }}>+{e.superavit} kcal · ~{e.gananciaMensualKg} kg/mes</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: i === 0 ? 'var(--acid)' : 'var(--ink)', lineHeight: 1 }}>{e.calorias}</div>
            </div>
          ))}
          <ShareButtons text={`Para ganar músculo necesito unas ${res.escenarios[1].calorias} kcal/día. Calcula tu superávit en CalcFit:`} url="https://www.calcfit.com/superavit-calorico" />
        </div>
      )}
    </div>
  );
}
