import { useState } from 'react';
import { calcularTasaSudoracion } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function TasaSudoracionCalculator() {
  const [pesoAntes,   setPesoAntes]   = useState('');
  const [pesoDespues, setPesoDespues] = useState('');
  const [fluidos,     setFluidos]     = useState('');
  const [duracion,    setDuracion]    = useState('');
  const [result, setResult]           = useState<ReturnType<typeof calcularTasaSudoracion> | null>(null);
  const [errors, setErrors]           = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const a  = parseFloat(pesoAntes);
    const d  = parseFloat(pesoDespues);
    const fl = parseFloat(fluidos) || 0;
    const dur = parseFloat(duracion);

    if (isNaN(a) || a < 20 || a > 300)   errs.pesoAntes   = 'Entre 20 y 300 kg';
    if (isNaN(d) || d < 20 || d > 300)   errs.pesoDespues = 'Entre 20 y 300 kg';
    if (!isNaN(a) && !isNaN(d) && d > a) errs.pesoDespues = 'El peso después debe ser menor o igual';
    if (isNaN(dur) || dur < 10 || dur > 480) errs.duracion = 'Entre 10 y 480 minutos';

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setResult(calcularTasaSudoracion(a, d, fl, dur));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Pésate antes y después del ejercicio (sin ropa y tras vaciar la vejiga) para calcular tu tasa de sudoración y necesidades de hidratación.
      </div>

      <Input label="Peso antes del ejercicio" value={pesoAntes}   onChange={setPesoAntes}   suffix="kg" error={errors.pesoAntes} />
      <Input label="Peso después del ejercicio" value={pesoDespues} onChange={setPesoDespues} suffix="kg" error={errors.pesoDespues} />
      <Input label="Líquidos consumidos durante" value={fluidos} onChange={setFluidos} suffix="litros" error={errors.fluidos} />
      <Input label="Duración del ejercicio" value={duracion} onChange={setDuracion} suffix="minutos" error={errors.duracion} />

      <Button onClick={calcular}>Calcular tasa</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Tasa de sudoración</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: 'var(--acid)', lineHeight: 1 }}>{result.tasaMLhora}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>mL/hora</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Pérdida de peso</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: '#ccc', lineHeight: 1 }}>{result.perdidaPorcentaje}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>% corporal</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Reponer por hora</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: result.color, lineHeight: 1 }}>{result.recomendacionMLhora}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>mL/hora</div>
            </div>
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            <strong>Tasa {result.estado.toLowerCase()}</strong> — {result.recomendacion}
          </div>

          {result.perdidaPorcentaje >= 2 && (
            <div style={{ padding: '12px 16px', background: '#F8717122', borderLeft: '3px solid #F87171', fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>
              Una pérdida de peso mayor al 2% durante el ejercicio puede perjudicar el rendimiento y la termorregulación. Recuerda hidratarte antes, durante y después.
            </div>
          )}

          <ShareButtons
            text={`Mi tasa de sudoración es ${result.tasaMLhora} mL/hora. Necesito reponer ${result.recomendacionMLhora} mL por hora durante el ejercicio. Calculado con CalcFit:`}
            url="https://www.calcfit.com/tasa-sudoracion"
          />
        </div>
      )}
    </div>
  );
}
