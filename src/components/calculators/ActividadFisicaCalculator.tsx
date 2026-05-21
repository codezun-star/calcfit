import { useState } from 'react';
import { calcularActividadFisicaOMS } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function ActividadFisicaCalculator() {
  const [minModera,   setMinModera]   = useState('');
  const [minVigoroso, setMinVigoroso] = useState('');
  const [diasFuerza,  setDiasFuerza]  = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularActividadFisicaOMS> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const mo = parseFloat(minModera)   || 0;
    const vi = parseFloat(minVigoroso) || 0;
    const df = parseFloat(diasFuerza)  || 0;
    if (mo < 0 || mo > 840)  errs.minModera   = 'Entre 0 y 840 min';
    if (vi < 0 || vi > 420)  errs.minVigoroso = 'Entre 0 y 420 min';
    if (df < 0 || df > 7)    errs.diasFuerza  = 'Entre 0 y 7 días';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setResult(calcularActividadFisicaOMS(mo, vi, df));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        <strong>OMS 2020 — Adultos 18–64 años:</strong> ≥150 min de actividad moderada (o ≥75 min vigorosa) más ≥2 días de fuerza por semana.
        Actividad moderada: caminar rápido, ciclismo suave, baile. Vigorosa: correr, natación rápida, ciclismo intenso.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Actividad moderada"  value={minModera}   onChange={setMinModera}   suffix="min/sem" error={errors.minModera} />
        <Input label="Actividad vigorosa"  value={minVigoroso} onChange={setMinVigoroso} suffix="min/sem" error={errors.minVigoroso} />
        <Input label="Días de fuerza"      value={diasFuerza}  onChange={setDiasFuerza}  suffix="días/sem" error={errors.diasFuerza} />
      </div>

      <Button onClick={calcular}>Evaluar actividad</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', gap: '32px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>MET·min/semana</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{result.metMinSemana}</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Nivel OMS</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: result.color, lineHeight: 1.1 }}>{result.nivelNombre}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '10px 14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Equiv. moderada</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.equivalenteModera} min</div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '10px 14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Recomendación OMS</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: result.cumpleRecomendacion ? '#34D399' : '#F87171' }}>
                {result.cumpleRecomendacion ? 'Cumple' : 'No cumple'}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Umbrales OMS 2020</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { nivel: 'Inactivo',      met: '0 MET·min',       color: '#F87171' },
                { nivel: 'Insuficiente',  met: '1–599 MET·min',   color: '#FB923C' },
                { nivel: 'Suficiente',    met: '600–1199 MET·min', color: '#CAFF00' },
                { nivel: 'Óptimo',        met: '≥ 1200 MET·min',  color: '#34D399' },
              ].map(row => (
                <div key={row.nivel} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: row.nivel === result.nivelNombre ? 'var(--ink)' : 'var(--cream)' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: row.nivel === result.nivelNombre ? '#fff' : 'var(--ink)' }}>{row.nivel}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: row.color }}>{row.met}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.recomendacion}
          </div>

          <ShareButtons
            text={`Mi nivel de actividad física OMS: ${result.nivelNombre} (${result.metMinSemana} MET·min/sem). Evalúa el tuyo en CalcFit:`}
            url="https://www.calcfit.com/actividad-fisica"
          />
        </div>
      )}
    </div>
  );
}
