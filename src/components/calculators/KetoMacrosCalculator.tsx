import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularKetoMacros } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function KetoMacrosCalculator() {
  const [tdee, setTdee]       = useState('2200');
  const [objetivo, setObjetivo] = useState<'perder' | 'mantener' | 'ganar'>('perder');
  const [res, setRes]         = useState<ReturnType<typeof calcularKetoMacros> | null>(null);
  const [error, setError]     = useState('');

  function calcular() {
    const t = parseFloat(tdee);
    if (!t || t < 1000 || t > 6000) { setError('Introduce tu gasto (TDEE) entre 1000 y 6000 kcal'); return; }
    setError('');
    setRes(calcularKetoMacros(t, objetivo));
  }

  const seg = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.5px',
  });

  const macro = (label: string, g: number, pct: number, color: string) => (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color, lineHeight: 1 }}>{g}</div>
      <div style={{ fontSize: '11px', color: '#aaa' }}>g · {pct}%</div>
    </div>
  );

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '240px' }}>
        <Input label="Gasto energético diario (TDEE)" value={tdee} onChange={setTdee} suffix="kcal" type="number" />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Objetivo</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setObjetivo('perder')} style={seg(objetivo === 'perder')}>Perder grasa</button>
          <button onClick={() => setObjetivo('mantener')} style={seg(objetivo === 'mantener')}>Mantener</button>
          <button onClick={() => setObjetivo('ganar')} style={seg(objetivo === 'ganar')}>Ganar</button>
        </div>
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular macros keto</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Calorías objetivo</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{res.calorias}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>kcal/día en cetosis</div>
          </div>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {macro('Grasas', res.grasaG, res.grasaPct, 'var(--acid)')}
            {macro('Proteína', res.proteinaG, res.proteinaPct, 'white')}
            {macro('Carbos', res.carbosG, res.carbosPct, 'white')}
          </div>
          <ShareButtons text={`Mis macros keto: ${res.grasaG}g grasa, ${res.proteinaG}g proteína, ${res.carbosG}g carbos. Calcula los tuyos en CalcFit:`} url="https://www.calcfit.com/keto-macros" />
        </div>
      )}
    </div>
  );
}
