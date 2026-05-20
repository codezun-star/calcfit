import { useState } from 'react';
import { calcularVAM } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function VAMCalculator() {
  const [vo2max, setVo2max]   = useState('');
  const [result, setResult]   = useState<ReturnType<typeof calcularVAM> | null>(null);
  const [error, setError]     = useState('');

  const calcular = () => {
    const v = parseFloat(vo2max);
    if (isNaN(v) || v < 20 || v > 90) {
      setError('Introduce un VO₂ máx entre 20 y 90 mL/kg/min');
      return;
    }
    setError('');
    setResult(calcularVAM(v));
  };

  const pctKmh = (pct: number) =>
    result ? Math.round(result.vam * pct / 100 * 10) / 10 : 0;

  const COLORES = ['#60A5FA', '#34D399', '#CAFF00', '#FB923C', '#F87171'];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        La VAM (Velocidad Aeróbica Máxima) es la velocidad mínima a la que alcanzas tu VO₂ máx. Se usa para calcular las zonas de entrenamiento de carrera.
      </div>

      <Input
        label="VO₂ máx"
        value={vo2max}
        onChange={setVo2max}
        suffix="mL/kg/min"
        error={error}
      />

      <Button onClick={calcular}>Calcular VAM</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{result.vam}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#aaa' }}>km/h (VAM)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.zonas.map((zona, i) => {
              const kmhMin = pctKmh(zona.porcentajeMin);
              const kmhMax = zona.porcentajeMax > 100
                ? Math.round(result.vam * 1.2 * 10) / 10
                : pctKmh(zona.porcentajeMax);
              return (
                <div key={zona.nombre} style={{ border: '1px solid var(--border)', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', background: COLORES[i], flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{zona.nombre}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: COLORES[i] }}>
                      {kmhMin}–{kmhMax} km/h
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5, paddingLeft: '18px' }}>{zona.descripcion}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', paddingLeft: '18px', marginTop: '2px' }}>
                    {zona.porcentajeMin}–{zona.porcentajeMax}% VAM
                  </div>
                </div>
              );
            })}
          </div>

          <ShareButtons
            text={`Mi VAM es ${result.vam} km/h (basada en un VO₂ máx de ${vo2max} mL/kg/min). Calcula la tuya en CalcFit:`}
            url="https://www.calcfit.com/vam"
          />
        </div>
      )}
    </div>
  );
}
