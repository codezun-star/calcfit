import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';
import { calcularTestFlexiones } from '../../lib/calculators';

export default function TestFlexionesCalculator() {
  const [repes, setRepes]       = useState('20');
  const [edad, setEdad]         = useState('35');
  const [variante, setVariante] = useState<'estandar' | 'rodillas'>('estandar');
  const [res, setRes]           = useState<ReturnType<typeof calcularTestFlexiones> | null>(null);
  const [error, setError]       = useState('');

  function calcular() {
    const r = parseInt(repes, 10);
    const e = parseFloat(edad);
    if (isNaN(r) || r < 0 || r > 200) { setError('Introduce un número de flexiones entre 0 y 200'); return; }
    if (!e || e < 18 || e > 90)       { setError('Introduce una edad entre 18 y 90 años'); return; }
    setError('');
    setRes(calcularTestFlexiones(r, e, variante));
  }

  const seg = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px', border: '1px solid', borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.5px',
  });

  const COLOR: Record<string, string> = {
    excelente: 'var(--acid)',
    bueno:     'var(--acid)',
    promedio:  'white',
    regular:   'white',
    bajo:      '#F87171',
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Tipo de flexión</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => { setVariante('estandar'); setRes(null); }} style={seg(variante === 'estandar')}>Estándar</button>
          <button onClick={() => { setVariante('rodillas'); setRes(null); }} style={seg(variante === 'rodillas')}>Rodillas apoyadas</button>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '10px' }}>
          Los baremos publicados por el ACSM miden flexiones estándar en hombres y flexiones con rodillas apoyadas en mujeres. Elige la variante que hayas hecho.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Flexiones seguidas" value={repes} onChange={v => { setRepes(v); setRes(null); }} suffix="cant." type="number" />
        <Input label="Edad" value={edad} onChange={v => { setEdad(v); setRes(null); }} suffix="años" type="number" />
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Ver mi nivel</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Tu nivel · {res.franjaEdad}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: COLOR[res.nivel], lineHeight: 1 }}>{res.nivelNombre}</div>
            <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px' }}>
              {res.repeticiones} flexiones {res.variante === 'estandar' ? 'estándar' : 'con rodillas apoyadas'}
            </div>
            <p style={{ fontSize: '13px', color: '#999', lineHeight: 1.7 }}>{res.descripcion}</p>
            {res.minimoSiguiente !== null && (
              <p style={{ fontSize: '13px', color: 'var(--acid)', lineHeight: 1.7, marginTop: '8px' }}>
                Te faltan {res.minimoSiguiente - res.repeticiones} repeticiones para subir de nivel.
              </p>
            )}
          </div>

          <div style={{ padding: '18px 0' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Baremo para {res.franjaEdad}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                {res.baremo.map(b => {
                  const activo = b.nivel === res.nivelNombre;
                  return (
                    <tr key={b.nivel} style={{ borderBottom: '1px solid var(--border)', background: activo ? 'var(--acid)' : 'transparent' }}>
                      <td style={{ padding: '9px 8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)', fontWeight: activo ? 600 : 400 }}>{b.nivel}</td>
                      <td style={{ padding: '9px 8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)', textAlign: 'right', fontWeight: activo ? 600 : 400 }}>{b.rango}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ShareButtons text={`He hecho ${res.repeticiones} flexiones: nivel ${res.nivelNombre} para mi edad. Mide el tuyo en CalcFit:`} url="https://www.calcfit.com/test-flexiones" />
        </div>
      )}
    </div>
  );
}
