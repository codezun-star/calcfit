import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularZincDiario } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function ZincDiarioCalculator() {
  const [edad, setEdad]   = useState('30');
  const [sexo, setSexo]   = useState<'hombre' | 'mujer'>('hombre');
  const [etapa, setEtapa] = useState<'ninguna' | 'embarazo' | 'lactancia'>('ninguna');
  const [res, setRes]     = useState<ReturnType<typeof calcularZincDiario> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const e = parseFloat(edad);
    if (isNaN(e) || e < 1 || e > 120) { setError('Introduce una edad válida (1–120 años)'); return; }
    setError('');
    setRes(calcularZincDiario(e, sexo, sexo === 'mujer' ? etapa : 'ninguna'));
  }

  const seg = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.5px',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '160px' }}>
        <Input label="Edad" value={edad} onChange={setEdad} suffix="años" type="number" />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Sexo</div>
        <div style={{ display: 'flex', gap: '4px', maxWidth: '260px' }}>
          <button onClick={() => setSexo('hombre')} style={seg(sexo === 'hombre')}>Hombre</button>
          <button onClick={() => setSexo('mujer')} style={seg(sexo === 'mujer')}>Mujer</button>
        </div>
      </div>
      {sexo === 'mujer' && (
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Etapa</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setEtapa('ninguna')} style={seg(etapa === 'ninguna')}>Ninguna</button>
            <button onClick={() => setEtapa('embarazo')} style={seg(etapa === 'embarazo')}>Embarazo</button>
            <button onClick={() => setEtapa('lactancia')} style={seg(etapa === 'lactancia')}>Lactancia</button>
          </div>
        </div>
      )}
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular zinc diario</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Zinc recomendado</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{res.rdaMg}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>mg/día · máximo tolerable {res.ulMg} mg</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{res.mensaje}</p>
          </div>
          <ShareButtons text={`Mi zinc diario recomendado es ${res.rdaMg} mg. Calcula el tuyo en CalcFit:`} url="https://www.calcfit.com/zinc-diario" />
        </div>
      )}
    </div>
  );
}
