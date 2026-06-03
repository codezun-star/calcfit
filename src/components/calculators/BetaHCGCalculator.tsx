import { useState } from 'react';
import { calcularBetaHCG } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function BetaHCGCalculator() {
  const [hcg1, setHcg1] = useState('');
  const [hcg2, setHcg2] = useState('');
  const [dias, setDias] = useState('2');
  const [result, setResult] = useState<ReturnType<typeof calcularBetaHCG> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const v1 = parseFloat(hcg1);
    const v2 = parseFloat(hcg2);
    const d  = parseFloat(dias);
    if (isNaN(v1) || v1 <= 0) errs.hcg1 = 'Valor debe ser mayor a 0';
    if (isNaN(v2) || v2 <= 0) errs.hcg2 = 'Valor debe ser mayor a 0';
    if (isNaN(d)  || d < 1 || d > 7) errs.dias = 'Días entre análisis: 1 a 7';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularBetaHCG(v1, v2, d));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
        <Input label="Beta-hCG primera muestra" value={hcg1} onChange={setHcg1} suffix="mUI/ml" error={errors.hcg1} />
        <Input label="Beta-hCG segunda muestra" value={hcg2} onChange={setHcg2} suffix="mUI/ml" error={errors.hcg2} />
        <Input label="Días entre análisis" value={dias} onChange={setDias} suffix="días" error={errors.dias} />
      </div>
      <Button onClick={calcular}>Interpretar beta-hCG</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px 28px', borderTop: `4px solid ${result.color}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Interpretación</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: result.color, lineHeight: 1.2 }}>{result.interpretacion}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Aumento total</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>{result.tasaAumentoPct}<span style={{ fontSize: '14px' }}>%</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Tiempo duplicación</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>
                {result.tiempoDuplicacion > 0 ? `${result.tiempoDuplicacion}` : '—'}<span style={{ fontSize: '14px' }}>{result.tiempoDuplicacion > 0 ? ' días' : ''}</span>
              </div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Semana estimada</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{result.semanaEstimada}</div>
            </div>
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{result.recomendacion}</p>
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '12px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Valores de referencia (ascenso mínimo en 48 h)</div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { label: 'Hasta semana 6', valor: '≥ 66%' },
                { label: 'Semanas 6–7', valor: '≥ 53%' },
                { label: 'Ascenso diario', valor: '≥ 25%' },
              ].map((r, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>{r.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)' }}>{r.valor}</div>
                </div>
              ))}
            </div>
          </div>

          <ShareButtons
            text={`Mi beta-hCG aumentó un ${result.tasaAumentoPct}% en ${dias} días. ${result.interpretacion}. CalcFit:`}
            url="https://www.calcfit.com/beta-hcg"
          />
        </div>
      )}
    </div>
  );
}
