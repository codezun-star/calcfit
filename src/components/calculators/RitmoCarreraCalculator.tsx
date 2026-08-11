import { useState } from 'react';
import { calcularRitmoCarrera } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function RitmoCarreraCalculator() {
  const [distancia, setDistancia] = useState('');
  const [minutos, setMinutos] = useState('');
  const [segundos, setSegundos] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularRitmoCarrera> | null>(null);
  const [errors, setErrors] = useState<{ distancia?: string; tiempo?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const km   = parseFloat(distancia);
    const min  = parseFloat(minutos) || 0;
    const seg  = parseFloat(segundos) || 0;
    const totalMin = min + seg / 60;
    if (!distancia || isNaN(km) || km <= 0 || km > 1000)    errs.distancia = 'Distancia entre 0.1 y 1000 km';
    if ((!minutos && !segundos) || totalMin <= 0)            errs.tiempo    = 'Ingresa el tiempo completado';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularRitmoCarrera(km, totalMin));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input label="Distancia recorrida" value={distancia} onChange={setDistancia} suffix="km" error={errors.distancia} />

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Tiempo empleado</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
          <Input label="Minutos" value={minutos}  onChange={setMinutos}  suffix="min" error={errors.tiempo} />
          <Input label="Segundos" value={segundos} onChange={setSegundos} suffix="seg" />
        </div>
      </div>

      <Button onClick={calcular}>Calcular ritmo</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px' }}>
            <div style={{ paddingRight: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Ritmo /km</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: 'var(--acid)', lineHeight: 1 }}>{result.ritmoMinPorKm}</div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>min/km</div>
            </div>
            <div style={{ paddingRight: '16px', borderLeft: '1px solid #222', paddingLeft: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Ritmo /milla</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: 'white', lineHeight: 1 }}>{result.ritmoMinPorMilla}</div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>min/mi</div>
            </div>
            <div style={{ borderLeft: '1px solid #222', paddingLeft: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Velocidad</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: 'white', lineHeight: 1 }}>{result.velocidadKmh}</div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>km/h</div>
            </div>
          </div>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Tiempos proyectados</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {result.tiempos.map(t => (
              <div key={t.distancia} style={{ background: 'var(--cream)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{t.distancia}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{t.tiempo}</span>
              </div>
            ))}
          </div>

          <ShareButtons text={`Mi ritmo de carrera es ${result.ritmoMinPorKm} min/km (${result.velocidadKmh} km/h). Calculado en CalcFit:`} url="https://www.calcfit.com/ritmo-carrera" />
        </div>
      )}
    </div>
  );
}
