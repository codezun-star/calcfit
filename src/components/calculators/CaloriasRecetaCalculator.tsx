import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';
import { calcularCaloriasReceta } from '../../lib/calculators';

interface Fila {
  nombre:  string;
  gramos:  string;
  kcal100: string;
}

const FILA_VACIA: Fila = { nombre: '', gramos: '', kcal100: '' };

// Referencias rápidas de kcal por 100 g de los ingredientes más habituales
const REFERENCIAS: Array<{ nombre: string; kcal100: number }> = [
  { nombre: 'Aceite de oliva', kcal100: 884 },
  { nombre: 'Arroz crudo',     kcal100: 350 },
  { nombre: 'Pasta cruda',     kcal100: 371 },
  { nombre: 'Pechuga de pollo', kcal100: 165 },
  { nombre: 'Huevo',           kcal100: 143 },
  { nombre: 'Patata',          kcal100: 77 },
  { nombre: 'Tomate',          kcal100: 18 },
  { nombre: 'Cebolla',         kcal100: 40 },
  { nombre: 'Queso curado',    kcal100: 390 },
  { nombre: 'Azúcar',          kcal100: 400 },
];

export default function CaloriasRecetaCalculator() {
  const [filas, setFilas]     = useState<Fila[]>([{ ...FILA_VACIA }, { ...FILA_VACIA }, { ...FILA_VACIA }]);
  const [raciones, setRaciones] = useState('4');
  const [res, setRes]         = useState<ReturnType<typeof calcularCaloriasReceta> | null>(null);
  const [error, setError]     = useState('');

  function actualizar(index: number, campo: keyof Fila, valor: string) {
    setFilas(prev => prev.map((f, i) => (i === index ? { ...f, [campo]: valor } : f)));
    setRes(null);
  }

  function anadirFila() {
    setFilas(prev => [...prev, { ...FILA_VACIA }]);
    setRes(null);
  }

  function quitarFila(index: number) {
    setFilas(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
    setRes(null);
  }

  function calcular() {
    const r = parseFloat(raciones);
    if (!r || r < 1 || r > 50) { setError('Introduce un número de raciones entre 1 y 50'); return; }

    const ingredientes = filas
      .map(f => ({ nombre: f.nombre, gramos: parseFloat(f.gramos), kcal100: parseFloat(f.kcal100) }))
      .filter(i => !isNaN(i.gramos) && !isNaN(i.kcal100));

    if (ingredientes.length === 0) { setError('Añade al menos un ingrediente con su peso y sus kcal por 100 g'); return; }
    if (ingredientes.some(i => i.gramos <= 0 || i.gramos > 20000)) { setError('El peso de cada ingrediente debe estar entre 1 y 20.000 g'); return; }
    if (ingredientes.some(i => i.kcal100 < 0 || i.kcal100 > 900)) { setError('Las kcal por 100 g deben estar entre 0 y 900'); return; }

    setError('');
    setRes(calcularCaloriasReceta(ingredientes, r));
  }

  const NIVEL: Record<string, string> = {
    baja:  'Densidad calórica baja: receta saciante y ligera.',
    media: 'Densidad calórica media: un plato equilibrado.',
    alta:  'Densidad calórica alta: raciones pequeñas suman muchas calorías.',
  };

  const inputCell: React.CSSProperties = {
    width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
    padding: '8px 0', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none',
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Ingredientes
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filas.map((fila, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 28px', gap: '8px', alignItems: 'end' }}>
              <input
                style={inputCell}
                placeholder="Ingrediente"
                value={fila.nombre}
                onChange={e => actualizar(i, 'nombre', e.target.value)}
              />
              <input
                style={inputCell}
                type="number"
                placeholder="gramos"
                value={fila.gramos}
                onChange={e => actualizar(i, 'gramos', e.target.value)}
              />
              <input
                style={inputCell}
                type="number"
                placeholder="kcal/100g"
                value={fila.kcal100}
                onChange={e => actualizar(i, 'kcal100', e.target.value)}
              />
              <button
                onClick={() => quitarFila(i)}
                aria-label="Quitar ingrediente"
                style={{
                  background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)',
                  fontFamily: 'var(--font-mono)', fontSize: '14px', cursor: 'pointer', padding: '6px 0', lineHeight: 1,
                }}
              >
                −
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '14px' }}>
          <Button variant="ghost" size="sm" onClick={anadirFila}>+ Añadir ingrediente</Button>
        </div>
      </div>

      <Input label="Raciones que salen" value={raciones} onChange={v => { setRaciones(v); setRes(null); }} suffix="cant." type="number" />

      {error && <p style={{ color: '#F87171', fontSize: '13px' }}>{error}</p>}
      <Button onClick={calcular}>Calcular calorías</Button>

      {res && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Por ración</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{res.caloriasRacion}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>kcal · {res.pesoRacionG} g</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Receta completa</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'white', lineHeight: 1 }}>{res.caloriasTotales}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>kcal · {res.pesoTotalG} g</div>
            </div>
          </div>

          <div style={{ background: 'var(--ink-2)', padding: '18px 24px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Densidad calórica: {res.densidad} kcal/100 g
            </div>
            <p style={{ fontSize: '13px', color: '#999', lineHeight: 1.7 }}>{NIVEL[res.nivelDensidad]}</p>
          </div>

          {res.detalle.length > 0 && (
            <div style={{ padding: '18px 0' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                Qué aporta cada ingrediente
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {res.detalle.map((d, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--ink)', marginBottom: '3px' }}>
                      <span>{d.nombre}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)' }}>{d.kcal} kcal · {d.porcentaje}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--border)' }}>
                      <div style={{ height: '100%', width: `${d.porcentaje}%`, background: 'var(--ink)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ShareButtons text={`Mi receta tiene ${res.caloriasRacion} kcal por ración. Calcula las tuyas en CalcFit:`} url="https://www.calcfit.com/calorias-receta" />
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          kcal por 100 g de referencia
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '6px 16px' }}>
          {REFERENCIAS.map(r => (
            <div key={r.nombre} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)' }}>
              <span>{r.nombre}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{r.kcal100}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
