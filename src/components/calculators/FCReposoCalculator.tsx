import { useState } from 'react';
import { calcularFCReposo } from '../../lib/calculators';
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

const TABLA_H = [
  { cat: 'Atleta',    rango: '< 50 ppm',  color: '#34D399' },
  { cat: 'Excelente', rango: '50–58 ppm', color: '#CAFF00' },
  { cat: 'Bueno',     rango: '59–65 ppm', color: '#60A5FA' },
  { cat: 'Normal',    rango: '66–72 ppm', color: '#888' },
  { cat: 'Bajo',      rango: '73–81 ppm', color: '#FB923C' },
  { cat: 'Pobre',     rango: '> 81 ppm',  color: '#F87171' },
];
const TABLA_M = [
  { cat: 'Atleta',    rango: '< 54 ppm',  color: '#34D399' },
  { cat: 'Excelente', rango: '54–60 ppm', color: '#CAFF00' },
  { cat: 'Bueno',     rango: '61–67 ppm', color: '#60A5FA' },
  { cat: 'Normal',    rango: '68–73 ppm', color: '#888' },
  { cat: 'Bajo',      rango: '74–82 ppm', color: '#FB923C' },
  { cat: 'Pobre',     rango: '> 82 ppm',  color: '#F87171' },
];

export default function FCReposoCalculator() {
  const [sexo,     setSexo]     = useState<Sexo>('hombre');
  const [fcReposo, setFcReposo] = useState('');
  const [edad,     setEdad]     = useState('');
  const [result,   setResult]   = useState<ReturnType<typeof calcularFCReposo> | null>(null);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const fc = parseFloat(fcReposo);
    const e  = parseFloat(edad);
    if (isNaN(fc) || fc < 20 || fc > 120) errs.fcReposo = 'Entre 20 y 120 ppm';
    if (isNaN(e)  || e  < 15 || e  > 100) errs.edad     = 'Entre 15 y 100 años';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setResult(calcularFCReposo(fc, e, sexo));
  };

  const tabla = sexo === 'hombre' ? TABLA_H : TABLA_M;

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        La frecuencia cardíaca en reposo (FC reposo) es un indicador fiable de la condición cardiovascular. A menor FC en reposo, mayor eficiencia del corazón.
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
        <Input label="FC en reposo" value={fcReposo} onChange={setFcReposo} suffix="ppm" error={errors.fcReposo} />
        <Input label="Edad"         value={edad}     onChange={setEdad}     suffix="años" error={errors.edad} />
      </div>

      <Button onClick={calcular}>Evaluar FC reposo</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', gap: '32px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>FC en reposo</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{fcReposo}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#aaa', marginLeft: '6px' }}>ppm</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Nivel</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: result.color, lineHeight: 1.1 }}>{result.categoria}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '10px 14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>FC máx estimada</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.fcMaxEstimada} ppm</div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '10px 14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Reserva cardíaca</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.reservaCardiaca} ppm</div>
            </div>
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.descripcion}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {tabla.map(row => (
              <div key={row.cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: row.cat === result.categoria ? 'var(--ink)' : 'var(--cream)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: row.cat === result.categoria ? '#fff' : 'var(--ink)' }}>{row.cat}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: row.color }}>{row.rango}</span>
              </div>
            ))}
          </div>

          <ShareButtons
            text={`Mi FC en reposo es ${fcReposo} ppm — nivel ${result.categoria}. Evalúa la tuya en CalcFit:`}
            url="https://www.calcfit.com/fc-reposo"
          />
        </div>
      )}
    </div>
  );
}
