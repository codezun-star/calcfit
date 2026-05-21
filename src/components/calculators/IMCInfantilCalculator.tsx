import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { calcularIMCInfantil } from '../../lib/calculators';

export default function IMCInfantilCalculator() {
  const [peso, setPeso]         = useState('');
  const [altura, setAltura]     = useState('');
  const [edadAnios, setEdadAnios] = useState('');
  const [edadMeses, setEdadMeses] = useState('0');
  const [sexo, setSexo]         = useState<'nino' | 'nina'>('nino');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularIMCInfantil> | null>(null);
  const [error, setError]       = useState('');

  function calcular() {
    const kg  = parseFloat(peso);
    const cm  = parseFloat(altura);
    const anios = parseInt(edadAnios) || 0;
    const meses = parseInt(edadMeses) || 0;
    const totalMeses = anios * 12 + meses;

    if (!peso || isNaN(kg) || kg <= 0)       { setError('Introduce el peso del niño');           return; }
    if (!altura || isNaN(cm) || cm <= 0)     { setError('Introduce la altura del niño');         return; }
    if (!edadAnios || totalMeses < 24)       { setError('La edad mínima es 2 años');             return; }
    if (totalMeses > 228)                    { setError('La edad máxima es 19 años');             return; }

    setError('');
    setResultado(calcularIMCInfantil(kg, cm, totalMeses, sexo));
  }

  const btnStyle = (active: boolean) => ({
    padding: '8px 20px', border: '1px solid',
    borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent',
    color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const,
    letterSpacing: '1px', cursor: 'pointer',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', background: 'var(--cream)' }}>
      {/* Sexo */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Sexo</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setSexo('nino')} style={btnStyle(sexo === 'nino')}>Niño</button>
          <button onClick={() => setSexo('nina')} style={btnStyle(sexo === 'nina')}>Niña</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" type="number" />
        <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" type="number" />
        <Input label="Edad (años)" value={edadAnios} onChange={setEdadAnios} suffix="años" type="number" />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            Meses adicionales
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['0', '3', '6', '9'].map(m => (
              <button key={m} onClick={() => setEdadMeses(m)} style={{ ...btnStyle(edadMeses === m), padding: '6px 10px' }}>{m}m</button>
            ))}
          </div>
        </div>
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

      <Button onClick={calcular}>Calcular IMC pediátrico</Button>

      {resultado && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>IMC</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.imc}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>kg/m²</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Percentil</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>p{resultado.percentil}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Z-score</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.zScore > 0 ? '+' : ''}{resultado.zScore}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Clasificación</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', lineHeight: 1.2, color: resultado.color }}>{resultado.categoria}</div>
            </div>
          </div>

          {/* Barra de percentiles */}
          <div style={{ border: '1px solid var(--border)', borderTop: 'none', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
              <span>p3</span><span>p5</span><span>p50</span><span>p85</span><span>p95</span><span>p97</span>
            </div>
            <div style={{ background: 'var(--border)', height: '10px', position: 'relative', display: 'flex' }}>
              <div style={{ flex: '2', background: '#60A5FA', opacity: 0.4 }} />
              <div style={{ flex: '80', background: '#34D399', opacity: 0.4 }} />
              <div style={{ flex: '10', background: '#FB923C', opacity: 0.4 }} />
              <div style={{ flex: '8', background: '#F87171', opacity: 0.4 }} />
              <div style={{
                position: 'absolute', top: '-3px', bottom: '-3px',
                left: `${Math.min(99, Math.max(1, resultado.percentil))}%`,
                width: '4px', background: resultado.color,
                transform: 'translateX(-50%)',
              }} />
            </div>
            <div style={{ marginTop: '12px', padding: '12px', background: '#f9f6f0', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{resultado.recomendacion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
