import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularMasaMagra } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function MasaMagraCalculator() {
  const [peso, setPeso]   = useState('70');
  const [altura, setAltura] = useState('170');
  const [sexo, setSexo]   = useState<'hombre' | 'mujer'>('hombre');
  const [res, setRes]     = useState<ReturnType<typeof calcularMasaMagra> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const p = parseFloat(peso), a = parseFloat(altura);
    if (!p || p < 25 || p > 250) { setError('Introduce un peso entre 25 y 250 kg'); return; }
    if (!a || a < 120 || a > 230) { setError('Introduce una altura entre 120 y 230 cm'); return; }
    setError('');
    setRes(calcularMasaMagra(p, a, sexo));
  }

  const seg = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.5px',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Sexo</div>
        <div style={{ display: 'flex', gap: '4px', maxWidth: '260px' }}>
          <button onClick={() => setSexo('hombre')} style={seg(sexo === 'hombre')}>Hombre</button>
          <button onClick={() => setSexo('mujer')} style={seg(sexo === 'mujer')}>Mujer</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" type="number" />
        <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular masa magra</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Masa magra</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{res.masaMagraKg}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>kg · {res.porcentajeMagra}%</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Masa grasa</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'white', lineHeight: 1 }}>{res.masaGrasaKg}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>kg · {res.porcentajeGraso}%</div>
            </div>
          </div>
          <ShareButtons text={`Mi masa corporal magra es ${res.masaMagraKg} kg (${res.porcentajeMagra}%). Calcula la tuya en CalcFit:`} url="https://www.calcfit.com/masa-magra" />
        </div>
      )}
    </div>
  );
}
