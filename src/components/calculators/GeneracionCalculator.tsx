import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularGeneracion } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function GeneracionCalculator() {
  const [anio, setAnio]           = useState('');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularGeneracion> | null>(null);
  const [error, setError]         = useState('');

  function calcular() {
    const a = parseInt(anio);
    if (!anio || isNaN(a) || a < 1928 || a > new Date().getFullYear()) {
      setError('Introduce un año de nacimiento válido (1928 – hoy)'); return;
    }
    setError('');
    setResultado(calcularGeneracion(a));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '220px' }}>
        <Input label="Año de nacimiento" value={anio} onChange={setAnio} suffix="año" type="number" />
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Descubrir mi generación</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Perteneces a
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 6vw, 48px)', lineHeight: 1.1, marginBottom: '4px' }}
              dangerouslySetInnerHTML={{ __html: `<span style="color:${resultado.color}">${resultado.generacion}</span>` }}
            />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#aaa' }}>{resultado.rangoAnios}</div>
            <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#999' }}>
              Edad actual: {resultado.edadActual} años
            </div>
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px', marginBottom: '1px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{resultado.descripcion}</p>
          </div>

          <div style={{ border: '1px solid var(--border)', padding: '16px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Rasgos generacionales
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {resultado.caracteristicas.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--acid)', fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <ShareButtons
            text={`Soy ${resultado.generacion} (${resultado.rangoAnios}). Descubre tu generación en CalcFit:`}
            url="https://www.calcfit.com/generacion"
          />
        </div>
      )}
    </div>
  );
}
