import { useState } from 'react';
import { calcularPotenciaSalto } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

type Sexo = 'hombre' | 'mujer';

const pillStyle = (active: boolean) => ({
  padding: '8px 14px', fontSize: '12px', fontFamily: 'var(--font-mono)',
  border: '1px solid', borderRadius: '2px', cursor: 'pointer',
  background: active ? 'var(--ink)' : 'transparent',
  color:      active ? 'var(--acid)' : 'var(--muted)',
  borderColor: active ? 'var(--ink)' : 'var(--border)',
});

export default function PotenciaSaltoCalculator() {
  const [peso,    setPeso]    = useState('');
  const [altura,  setAltura]  = useState('');
  const [sexo,    setSexo]    = useState<Sexo>('hombre');
  const [result,  setResult]  = useState<ReturnType<typeof calcularPotenciaSalto> | null>(null);
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const p = parseFloat(peso);
    const h = parseFloat(altura);
    if (isNaN(p) || p < 30 || p > 250)  errs.peso   = 'Peso entre 30 y 250 kg';
    if (isNaN(h) || h < 10 || h > 120)  errs.altura = 'Altura de salto entre 10 y 120 cm';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setResult(calcularPotenciaSalto(p, h, sexo));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Calcula tu potencia explosiva de piernas usando la fórmula de Sayers (1999), validada con pruebas de salto vertical.
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Sexo biológico</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['hombre', 'mujer'] as Sexo[]).map(s => (
            <button key={s} onClick={() => setSexo(s)} style={pillStyle(sexo === s)}>
              {s === 'hombre' ? 'Hombre' : 'Mujer'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Peso corporal" value={peso} onChange={setPeso} suffix="kg" error={errors.peso} />
        <Input label="Altura de salto" value={altura} onChange={setAltura} suffix="cm" error={errors.altura} />
      </div>

      <Button onClick={calcular}>Calcular potencia</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', gap: '32px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Potencia pico</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{result.potenciaPicoW}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#aaa', marginLeft: '6px' }}>W</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>W/kg</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: result.color, lineHeight: 1 }}>{result.wattsPerKg}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Potencia media', valor: `${result.potenciaMediaW} W` },
              { label: 'Potencia pico',  valor: `${result.potenciaPicoW} W` },
              { label: 'Ratio W/kg',     valor: `${result.wattsPerKg} W/kg` },
            ].map(c => (
              <div key={c.label} style={{ background: 'var(--cream)', padding: '12px 14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{c.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{c.valor}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            <strong>{result.nivelNombre}</strong> — {result.descripcion}
          </div>

          <ShareButtons
            text={`Mi potencia de salto es ${result.potenciaPicoW} W (${result.wattsPerKg} W/kg) — nivel ${result.nivelNombre}. Calculado con CalcFit:`}
            url="https://www.calcfit.com/potencia-salto"
          />
        </div>
      )}
    </div>
  );
}
