import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularAnioBisiesto } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function AnioBisiestoCalculator() {
  const [anio, setAnio]   = useState(String(new Date().getFullYear()));
  const [res, setRes]     = useState<ReturnType<typeof calcularAnioBisiesto> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const a = parseInt(anio);
    if (isNaN(a) || a < 1 || a > 9999) { setError('Introduce un año válido (1–9999)'); return; }
    setError('');
    setRes(calcularAnioBisiesto(a));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '180px' }}>
        <Input label="Año" value={anio} onChange={setAnio} type="number" />
      </div>
      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Comprobar si es bisiesto</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{anio}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: res.esBisiesto ? 'var(--acid)' : 'white', lineHeight: 1 }}>{res.esBisiesto ? 'Sí es bisiesto' : 'No es bisiesto'}</div>
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>{res.diasDelAnio} días · próximo bisiesto: {res.proximoBisiesto}</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{res.motivo}</p>
          </div>
          <ShareButtons text={`${anio} ${res.esBisiesto ? 'sí' : 'no'} es bisiesto. Compruébalo en CalcFit:`} url="https://www.calcfit.com/anio-bisiesto" />
        </div>
      )}
    </div>
  );
}
