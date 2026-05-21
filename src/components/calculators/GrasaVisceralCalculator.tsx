import { useState } from 'react';
import { calcularGrasaVisceral } from '../../lib/calculators';
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

export default function GrasaVisceralCalculator() {
  const [sexo,    setSexo]    = useState<Sexo>('hombre');
  const [cintura, setCintura] = useState('');
  const [cadera,  setCadera]  = useState('');
  const [altura,  setAltura]  = useState('');
  const [edad,    setEdad]    = useState('');
  const [result,  setResult]  = useState<ReturnType<typeof calcularGrasaVisceral> | null>(null);
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const c  = parseFloat(cintura);
    const ca = parseFloat(cadera);
    const h  = parseFloat(altura);
    const e  = parseFloat(edad);
    if (isNaN(c)  || c  < 40 || c  > 200) errs.cintura = 'Entre 40 y 200 cm';
    if (isNaN(ca) || ca < 40 || ca > 200) errs.cadera  = 'Entre 40 y 200 cm';
    if (isNaN(h)  || h  < 100 || h > 250) errs.altura  = 'Entre 100 y 250 cm';
    if (isNaN(e)  || e  < 18 || e  > 100) errs.edad    = 'Entre 18 y 100 años';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setResult(calcularGrasaVisceral(c, ca, h, e, sexo));
  };

  const ESCALA = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Estimación del nivel de grasa visceral abdominal (escala 1–20, equivalente a la escala Tanita) basada en mediciones corporales y edad.
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px' }}>
        <Input label="Cintura"   value={cintura} onChange={setCintura} suffix="cm" error={errors.cintura} />
        <Input label="Cadera"    value={cadera}  onChange={setCadera}  suffix="cm" error={errors.cadera} />
        <Input label="Estatura"  value={altura}  onChange={setAltura}  suffix="cm" error={errors.altura} />
        <Input label="Edad"      value={edad}    onChange={setEdad}    suffix="años" error={errors.edad} />
      </div>

      <Button onClick={calcular}>Estimar grasa visceral</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{result.nivelEstimado}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#aaa' }}>/ 20</span>
          </div>

          {/* Escala visual */}
          <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
            {ESCALA.map(n => {
              const color = n <= 9 ? '#34D399' : n <= 14 ? '#FB923C' : '#F87171';
              const activo = n === result.nivelEstimado;
              return (
                <div key={n} style={{ flex: 1, height: activo ? '32px' : '18px', background: activo ? color : color + '55', transition: 'height 0.2s' }} title={String(n)} />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>
            <span>1 Saludable</span><span>10 Exceso</span><span>15–20 Riesgo</span>
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            <strong>{result.categoria}</strong> — {result.recomendacion}
          </div>

          <ShareButtons
            text={`Mi nivel de grasa visceral estimado es ${result.nivelEstimado}/20 (${result.categoria}). Calcula el tuyo en CalcFit:`}
            url="https://www.calcfit.com/grasa-visceral"
          />
        </div>
      )}
    </div>
  );
}
