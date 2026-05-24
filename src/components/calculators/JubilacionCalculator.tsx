import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calcularJubilacion, type PaisJubilacion } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

const PAISES: { val: PaisJubilacion; label: string }[] = [
  { val: 'argentina', label: 'Argentina' }, { val: 'mexico',    label: 'México' },
  { val: 'colombia',  label: 'Colombia' },  { val: 'chile',     label: 'Chile' },
  { val: 'peru',      label: 'Perú' },      { val: 'espana',    label: 'España' },
  { val: 'venezuela', label: 'Venezuela' }, { val: 'ecuador',   label: 'Ecuador' },
  { val: 'bolivia',   label: 'Bolivia' },   { val: 'paraguay',  label: 'Paraguay' },
  { val: 'uruguay',   label: 'Uruguay' },   { val: 'otro',      label: 'Otro' },
];

export default function JubilacionCalculator() {
  const [edad, setEdad]         = useState('');
  const [sexo, setSexo]         = useState<'hombre' | 'mujer'>('hombre');
  const [pais, setPais]         = useState<PaisJubilacion>('mexico');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularJubilacion> | null>(null);
  const [error, setError]       = useState('');

  function calcular() {
    const e = parseInt(edad);
    if (!edad || isNaN(e) || e < 18 || e > 100) { setError('Introduce tu edad actual (18–100)'); return; }
    setError('');
    setResultado(calcularJubilacion(e, sexo, pais));
  }

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px', border: '1px solid',
    borderColor: active ? 'var(--ink)' : 'var(--border)',
    background: active ? 'var(--ink)' : 'transparent',
    color: active ? 'var(--acid)' : 'var(--muted)',
    fontFamily: 'var(--font-mono)', fontSize: '10px',
    textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer',
  });

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '180px' }}>
        <Input label="Edad actual" value={edad} onChange={setEdad} suffix="años" type="number" />
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Sexo</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['hombre', 'mujer'] as const).map(s => (
            <button key={s} onClick={() => setSexo(s)} style={btnStyle(sexo === s)}>
              {s === 'hombre' ? 'Hombre' : 'Mujer'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>País</div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {PAISES.map(p => (
            <button key={p.val} onClick={() => setPais(p.val)} style={btnStyle(pais === p.val)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular jubilación</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Edad de jubilación</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.edadJubilacion}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>años</div>
            </div>
            {!resultado.yaJubilado && (
              <>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Tiempo restante</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'white', lineHeight: 1 }}>{resultado.aniosRestantes}</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>años</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Año estimado</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'white', lineHeight: 1 }}>{resultado.anioEstimado}</div>
                </div>
              </>
            )}
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px', marginBottom: '1px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{resultado.descripcion}</p>
          </div>

          {!resultado.yaJubilado && (
            <div style={{ border: '1px solid var(--border)', padding: '14px 16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Equivale a <strong style={{ color: 'var(--ink)' }}>{resultado.mesesRestantes}</strong> meses de trabajo restantes.
              </p>
            </div>
          )}

          <ShareButtons
            text={`Me jubilo en ${resultado.anioEstimado} según la normativa de ${resultado.paisNombre}. Calcula el tuyo en CalcFit:`}
            url="https://www.calcfit.com/jubilacion"
          />
        </div>
      )}
    </div>
  );
}
