import { useState } from 'react';
import { calcularVO2Max } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

type Sexo = 'hombre' | 'mujer';

export default function VO2MaxCalculator() {
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState<Sexo>('hombre');
  const [fcReposo, setFcReposo] = useState('');
  const [fcMaxima, setFcMaxima] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularVO2Max> | null>(null);
  const [errors, setErrors] = useState<{ edad?: string; fcReposo?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const edadN    = parseFloat(edad);
    const fcRep    = parseFloat(fcReposo);
    const fcMax    = fcMaxima ? parseFloat(fcMaxima) : undefined;
    if (!edad    || isNaN(edadN) || edadN < 10 || edadN > 100)    errs.edad    = 'Edad entre 10 y 100 años';
    if (!fcReposo || isNaN(fcRep) || fcRep < 30 || fcRep > 120)   errs.fcReposo = 'Frecuencia cardíaca en reposo: entre 30 y 120 ppm';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularVO2Max(edadN, sexo, fcRep, fcMax));
  };

  const nivelColor: Record<string, string> = {
    muy_bajo: '#F87171', bajo: '#FB923C', moderado: '#CAFF00',
    bueno: '#34D399', excelente: '#34D399', superior: '#34D399',
  };

  const selStyle: React.CSSProperties = {
    width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid var(--border)',
    background: 'transparent', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none', cursor: 'pointer',
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Edad" value={edad} onChange={setEdad} suffix="años" error={errors.edad} />
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Sexo biológico</p>
          <select value={sexo} onChange={e => setSexo(e.target.value as Sexo)} style={selStyle}>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
          </select>
        </div>
      </div>

      <Input label="Frecuencia cardíaca en reposo" value={fcReposo} onChange={setFcReposo} suffix="ppm" error={errors.fcReposo} />
      <Input label="Frec. cardíaca máxima (opcional, se calcula si se deja vacío)" value={fcMaxima} onChange={setFcMaxima} suffix="ppm" />

      <Button onClick={calcular}>Estimar VO2 máximo</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="VO2 máximo estimado" value={result.vo2max} unit="ml/kg/min" interpretation={result.categoria} />
          <div style={{ padding: '12px 16px', background: nivelColor[result.nivel] + '22', borderLeft: `3px solid ${nivelColor[result.nivel]}`, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>
            <strong>{result.categoria}</strong> — El VO2max mide la cantidad máxima de oxígeno que su cuerpo puede usar durante el ejercicio intenso. Es el indicador más preciso de la condición cardiovascular.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {[
              { nivel: 'Superior',   hombre: '> 60',  mujer: '> 53',  color: '#34D399' },
              { nivel: 'Excelente',  hombre: '52–60', mujer: '45–53', color: '#34D399' },
              { nivel: 'Bueno',      hombre: '42–52', mujer: '35–45', color: '#CAFF00' },
              { nivel: 'Moderado',   hombre: '34–42', mujer: '28–35', color: '#FB923C' },
              { nivel: 'Bajo',       hombre: '28–34', mujer: '22–28', color: '#F87171' },
              { nivel: 'Muy bajo',   hombre: '< 28',  mujer: '< 22',  color: '#DC2626' },
            ].map(row => (
              <div key={row.nivel} style={{ background: 'var(--cream)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', flexShrink: 0, background: row.color }} />
                <span style={{ fontSize: '13px', color: 'var(--ink)', flex: 1 }}>{row.nivel}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>H: {row.hombre} · M: {row.mujer}</span>
              </div>
            ))}
          </div>

          <ShareButtons text={`Mi VO2 máximo estimado es ${result.vo2max} ml/kg/min (${result.categoria}). Calculado en CalcFit:`} url="https://www.calcfit.com/vo2-maximo" />
        </div>
      )}
    </div>
  );
}
