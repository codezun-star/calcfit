import { useState } from 'react';
import { calcularRitmoNatacion } from '../../lib/calculators';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

type Largo = 25 | 50;

const pillStyle = (active: boolean) => ({
  padding: '8px 14px', fontSize: '12px', fontFamily: 'var(--font-mono)',
  border: '1px solid', borderRadius: '2px', cursor: 'pointer',
  background: active ? 'var(--ink)' : 'transparent',
  color:      active ? 'var(--acid)' : 'var(--muted)',
  borderColor: active ? 'var(--ink)' : 'var(--border)',
});

const numInput = (value: string, onChange: (v: string) => void, placeholder: string, width = '80px') => (
  <input
    type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
      padding: '8px 0', fontSize: '24px', fontFamily: 'var(--font-display)',
      color: 'var(--ink)', outline: 'none', width }}
  />
);

export default function RitmoNatacionCalculator() {
  const [distancia,  setDistancia]  = useState('');
  const [tiempoMin,  setTiempoMin]  = useState('');
  const [tiempoSeg,  setTiempoSeg]  = useState('');
  const [largo,      setLargo]      = useState<Largo>(25);
  const [result,     setResult]     = useState<ReturnType<typeof calcularRitmoNatacion> | null>(null);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const d  = parseFloat(distancia);
    const tm = parseFloat(tiempoMin) || 0;
    const ts = parseFloat(tiempoSeg) || 0;
    const totalSeg = tm * 60 + ts;

    if (isNaN(d) || d < 25 || d > 50000) errs.distancia = 'Entre 25 y 50000 m';
    if (totalSeg <= 0)                   errs.tiempo    = 'Introduce un tiempo válido';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setResult(calcularRitmoNatacion(d, tm, ts, largo));
  };

  const NIVELES = [
    { cat: 'Élite / Competitivo', ritmo: '< 1:00 /100m', color: '#34D399' },
    { cat: 'Competitivo',         ritmo: '1:00–1:20',    color: '#CAFF00' },
    { cat: 'Fitness / Avanzado',  ritmo: '1:20–1:40',    color: '#60A5FA' },
    { cat: 'Principiante',        ritmo: '1:40–2:00',    color: '#FB923C' },
    { cat: 'Muy principiante',    ritmo: '> 2:00',       color: '#F87171' },
  ];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '580px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Calcula tu pace (ritmo por 100m) a partir de la distancia recorrida y el tiempo total en piscina de 25m o 50m.
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Tipo de piscina</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setLargo(25)} style={pillStyle(largo === 25)}>Corta (25m)</button>
          <button onClick={() => setLargo(50)} style={pillStyle(largo === 50)}>Larga (50m)</button>
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Distancia nadada</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          {numInput(distancia, setDistancia, '0', '120px')}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)' }}>metros</span>
        </div>
        {errors.distancia && <p style={{ fontSize: '12px', color: '#F87171', marginTop: '4px' }}>{errors.distancia}</p>}
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Tiempo total</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          {numInput(tiempoMin, setTiempoMin, '0', '60px')}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--muted)' }}>min</span>
          {numInput(tiempoSeg, setTiempoSeg, '00', '60px')}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--muted)' }}>seg</span>
        </div>
        {errors.tiempo && <p style={{ fontSize: '12px', color: '#F87171', marginTop: '4px' }}>{errors.tiempo}</p>}
      </div>

      <Button onClick={calcular}>Calcular ritmo</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', gap: '24px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Ritmo cada 100m</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: 'var(--acid)', lineHeight: 1 }}>{result.ritmoPor100m}</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Categoría</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: result.color, lineHeight: 1.1 }}>{result.categoria}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'Ritmo /50m',       valor: result.ritmoPor50m },
              { label: 'Velocidad',         valor: `${result.velocidadKmh} km/h` },
              { label: 'Largos/min',        valor: String(result.largosPorMinuto) },
            ].map(c => (
              <div key={c.label} style={{ background: 'var(--cream)', padding: '10px 12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>{c.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)' }}>{c.valor}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {NIVELES.map(n => (
              <div key={n.cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: n.cat === result.categoria ? 'var(--ink)' : 'var(--cream)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: n.cat === result.categoria ? '#fff' : 'var(--ink)' }}>{n.cat}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: n.color }}>{n.ritmo}</span>
              </div>
            ))}
          </div>

          <ShareButtons
            text={`Mi ritmo de natación es ${result.ritmoPor100m} — ${result.categoria}. Calcula el tuyo en CalcFit:`}
            url="https://www.calcfit.com/ritmo-natacion"
          />
        </div>
      )}
    </div>
  );
}
