import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularAzucarDiario } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function AzucarDiarioCalculator() {
  const [calorias, setCalorias]   = useState('2000');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularAzucarDiario> | null>(null);
  const [error, setError]         = useState('');

  function calcular() {
    const c = parseInt(calorias);
    if (!calorias || isNaN(c) || c < 800 || c > 6000) { setError('Introduce un valor entre 800 y 6000 kcal/día'); return; }
    setError('');
    setResultado(calcularAzucarDiario(c));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '220px' }}>
        <Input label="Calorías diarias" value={calorias} onChange={setCalorias} suffix="kcal" type="number" />
      </div>
      <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '-12px' }}>
        Si no las conoces, una media habitual es 2000 kcal/día. Puedes calcular las tuyas con la calculadora de <a href="/calorias-diarias" style={{ color: 'var(--ink)' }}>calorías diarias</a>.
      </p>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular azúcar diario</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Límite máximo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.limiteMaxG}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>g/día · {resultado.limiteMaxCucharaditas} cdtas. · OMS &lt;10%</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Ideal</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'white', lineHeight: 1 }}>{resultado.idealG}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>g/día · {resultado.idealCucharaditas} cdtas. · OMS &lt;5%</div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Cuánto azúcar tienen (% de tu límite)</div>
            {resultado.ejemplos.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'baseline' }}>
                <span style={{ fontSize: '12px', color: 'var(--ink)' }}>{e.alimento}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: e.porcentajeDelLimite >= 100 ? '#dc2626' : 'var(--ink)' }}>
                  {e.azucarG} g · {e.porcentajeDelLimite}%
                </span>
              </div>
            ))}
          </div>
          <ShareButtons text={`Mi límite de azúcar es ${resultado.limiteMaxG} g/día (${resultado.limiteMaxCucharaditas} cucharaditas). Calcula el tuyo en CalcFit:`} url="https://www.calcfit.com/azucar-diario" />
        </div>
      )}
    </div>
  );
}
