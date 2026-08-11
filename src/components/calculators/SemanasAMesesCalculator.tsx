import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { convertirSemanasEmbarazoAMeses } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function SemanasAMesesCalculator() {
  const [semanas, setSemanas] = useState('20');
  const [res, setRes]   = useState<ReturnType<typeof convertirSemanasEmbarazoAMeses> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const s = parseFloat(semanas);
    if (isNaN(s) || s < 1 || s > 42) { setError('Introduce las semanas de embarazo (1–42)'); return; }
    setError('');
    setRes(convertirSemanasEmbarazoAMeses(s));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '220px' }}>
        <Input label="Semanas de embarazo" value={semanas} onChange={setSemanas} suffix="sem" type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Convertir a meses</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Mes de embarazo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{res.mesNumero}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>{res.texto}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Trimestre</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'white', lineHeight: 1 }}>{res.trimestre}.º</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>{res.semanas} semanas</div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              Los meses de embarazo no equivalen exactamente a 4 semanas: el embarazo dura 40 semanas (9 meses) repartidas de forma irregular. Por eso "estar de 6 meses" abarca varias semanas.
            </p>
          </div>
          <ShareButtons text={`Estoy de ${res.semanas} semanas, es decir, el ${res.texto} (${res.trimestre}.º trimestre). Calcula el tuyo en CalcFit:`} url="https://www.calcfit.com/semanas-a-meses" />
        </div>
      )}
    </div>
  );
}
