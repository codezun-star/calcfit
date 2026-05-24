import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularLactancia } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function LactanciaCalculator() {
  const [peso, setPeso]           = useState('');
  const [tomas, setTomas]         = useState('8');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularLactancia> | null>(null);
  const [error, setError]         = useState('');

  function calcular() {
    const p = parseFloat(peso.replace(',', '.'));
    const t = parseInt(tomas);
    if (!peso || isNaN(p) || p < 40 || p > 180) { setError('Introduce un peso válido (40–180 kg)'); return; }
    if (isNaN(t) || t < 4 || t > 16) { setError('Las tomas diarias deben estar entre 4 y 16'); return; }
    setError('');
    setResultado(calcularLactancia(p, t));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Peso de la madre" value={peso} onChange={setPeso} suffix="kg" type="number" />
        <Input label="Tomas por día" value={tomas} onChange={setTomas} suffix="tomas" type="number" />
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular lactancia</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Leche por toma</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.mlPorToma}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>ml aprox.</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Total diario</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'white', lineHeight: 1 }}>{resultado.mlTotalDia}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>ml/día</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Calorías extra</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'white', lineHeight: 1 }}>{resultado.caloriasExtra}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>kcal/día</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', marginBottom: '1px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#166534', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Beneficios para el bebé
              </div>
              {resultado.beneficiosBebe.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ color: '#34D399', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '11px', color: '#166534' }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Beneficios para la madre
              </div>
              {resultado.beneficiosMadre.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ color: '#60A5FA', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '11px', color: '#1e40af' }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{resultado.recomendacion}</p>
          </div>

          <ShareButtons
            text={`Calculé mis necesidades de lactancia: ${resultado.caloriasExtra} kcal extra al día. Calcula las tuyas en CalcFit:`}
            url="https://www.calcfit.com/lactancia"
          />
        </div>
      )}
    </div>
  );
}
