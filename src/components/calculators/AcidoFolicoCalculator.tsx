import { useState } from 'react';
import Button from '../ui/Button';
import { calcularAcidoFolico } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function AcidoFolicoCalculator() {
  const [etapa, setEtapa] = useState<'buscando' | 'embarazo' | 'lactancia'>('buscando');
  const [riesgo, setRiesgo] = useState<'normal' | 'alto'>('normal');
  const [res, setRes]   = useState<ReturnType<typeof calcularAcidoFolico> | null>(null);

  function calcular() {
    setRes(calcularAcidoFolico(etapa, riesgo));
  }

  const seg = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.5px',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Etapa</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setEtapa('buscando')} style={seg(etapa === 'buscando')}>Buscando</button>
          <button onClick={() => setEtapa('embarazo')} style={seg(etapa === 'embarazo')}>Embarazo</button>
          <button onClick={() => setEtapa('lactancia')} style={seg(etapa === 'lactancia')}>Lactancia</button>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Nivel de riesgo</div>
        <div style={{ display: 'flex', gap: '4px', maxWidth: '320px' }}>
          <button onClick={() => setRiesgo('normal')} style={seg(riesgo === 'normal')}>Estándar</button>
          <button onClick={() => setRiesgo('alto')} style={seg(riesgo === 'alto')}>Alto riesgo</button>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '8px' }}>
          Alto riesgo: antecedentes de defectos del tubo neural, diabetes, epilepsia u obesidad.
        </p>
      </div>
      <Button onClick={calcular}>Calcular dosis</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Ácido fólico recomendado</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{res.dosisMcg}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>mcg/día ({(res.dosisMcg / 1000).toFixed(res.dosisMcg >= 1000 ? 0 : 1)} mg)</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 600, marginBottom: '6px' }}>Cuándo empezar</p>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '10px' }}>{res.cuandoEmpezar}</p>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{res.mensaje}</p>
          </div>
          <ShareButtons text={`Mi dosis de ácido fólico recomendada es ${res.dosisMcg} mcg/día. Calcula la tuya en CalcFit:`} url="https://www.calcfit.com/acido-folico" />
        </div>
      )}
    </div>
  );
}
