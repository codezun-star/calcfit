import { useState } from 'react';
import Button from '../ui/Button';
import { calcularNumeroSemana } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function NumeroSemanaCalculator() {
  const hoy = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha] = useState(hoy);
  const [res, setRes]     = useState<ReturnType<typeof calcularNumeroSemana> | null>(null);

  function calcular() {
    if (!fecha) return;
    setRes(calcularNumeroSemana(fecha));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Fecha</div>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', maxWidth: '240px', padding: '8px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '15px', color: 'var(--ink)', fontFamily: 'var(--font-body)', outline: 'none' }} />
      </div>
      <Button onClick={calcular}>Calcular número de semana</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Semana ISO del año</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '80px', color: 'var(--acid)', lineHeight: 1 }}>{res.semana}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>de {res.anio} · día {res.diaDelAnio} del año · {res.trimestre}.º trimestre</div>
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
              El número de semana sigue el estándar ISO 8601: las semanas empiezan en lunes y la semana 1 es la que contiene el primer jueves del año.
            </p>
          </div>
          <ShareButtons text={`Esa fecha cae en la semana ${res.semana} de ${res.anio}. Calcúlalo en CalcFit:`} url="https://www.calcfit.com/numero-semana" />
        </div>
      )}
    </div>
  );
}
