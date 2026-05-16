import { useState } from 'react';
import { calcularCicloMenstrual } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function CicloMenstrualCalculator() {
  const [ultimaMens, setUltimaMens] = useState('');
  const [durCiclo, setDurCiclo] = useState('28');
  const [durPeriodo, setDurPeriodo] = useState('5');
  const [result, setResult] = useState<ReturnType<typeof calcularCicloMenstrual> | null>(null);
  const [errors, setErrors] = useState<{ ultimaMens?: string; durCiclo?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const fecha = new Date(ultimaMens);
    const ciclo  = parseInt(durCiclo, 10);
    const periodo = parseInt(durPeriodo, 10);
    if (!ultimaMens || isNaN(fecha.getTime())) errs.ultimaMens = 'Fecha inválida';
    if (isNaN(ciclo) || ciclo < 20 || ciclo > 45) errs.durCiclo = 'Ciclo entre 20 y 45 días';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularCicloMenstrual(fecha, ciclo, Math.max(1, Math.min(periodo, ciclo - 1))));
  };

  const fmtFecha = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Fecha de inicio de la última menstruación</p>
        <input
          type="date"
          value={ultimaMens}
          onChange={e => setUltimaMens(e.target.value)}
          style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: errors.ultimaMens ? '1px solid #F87171' : '1px solid var(--border)', background: 'transparent', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none' }}
        />
        {errors.ultimaMens && <p style={{ fontSize: '11px', color: '#F87171', marginTop: '4px' }}>{errors.ultimaMens}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Duración del ciclo" value={durCiclo}   onChange={setDurCiclo}   suffix="días" error={errors.durCiclo} />
        <Input label="Duración del período" value={durPeriodo} onChange={setDurPeriodo} suffix="días" />
      </div>

      <Button onClick={calcular}>Calcular ciclo</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>Día actual del ciclo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{result.diaActual}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Fase: <strong style={{ color: 'white' }}>{result.faseActual}</strong></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>Próxima menstruación</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>{fmtFecha(result.proximaMenstruacion)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {result.fases.map(fase => (
              <div key={fase.nombre} style={{ background: 'var(--cream)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', flexShrink: 0, background: fase.color }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{fase.nombre}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{fase.descripcion}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textAlign: 'right' }}>
                  {fase.inicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} – {fase.fin.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            ))}
          </div>

          <ShareButtons text={`Calculé mi ciclo menstrual en CalcFit. Herramienta gratuita:`} url="https://www.calcfit.com/ciclo-menstrual" />
        </div>
      )}
    </div>
  );
}
