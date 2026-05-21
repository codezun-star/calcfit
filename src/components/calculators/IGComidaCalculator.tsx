import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { calcularIGComida, type AlimentoIG } from '../../lib/calculators';

const ALIMENTOS_COMUNES: AlimentoIG[] = [
  { nombre: 'Pan blanco',     ig: 75, carbsG: 0 },
  { nombre: 'Arroz blanco',   ig: 72, carbsG: 0 },
  { nombre: 'Arroz integral', ig: 55, carbsG: 0 },
  { nombre: 'Avena',          ig: 55, carbsG: 0 },
  { nombre: 'Pasta (al dente)', ig: 45, carbsG: 0 },
  { nombre: 'Plátano',        ig: 52, carbsG: 0 },
  { nombre: 'Manzana',        ig: 38, carbsG: 0 },
  { nombre: 'Zanahoria',      ig: 35, carbsG: 0 },
  { nombre: 'Lentejas',       ig: 29, carbsG: 0 },
  { nombre: 'Patata cocida',  ig: 78, carbsG: 0 },
];

type AlimentoRow = { nombre: string; ig: string; carbsG: string };

const emptyRow = (): AlimentoRow => ({ nombre: '', ig: '', carbsG: '' });

export default function IGComidaCalculator() {
  const [filas, setFilas]       = useState<AlimentoRow[]>([emptyRow(), emptyRow()]);
  const [resultado, setResultado] = useState<ReturnType<typeof calcularIGComida> | null>(null);
  const [error, setError]       = useState('');

  function updateFila(i: number, campo: keyof AlimentoRow, val: string) {
    setFilas(prev => prev.map((f, idx) => idx === i ? { ...f, [campo]: val } : f));
  }

  function aplicarComun(i: number, alimento: AlimentoIG) {
    setFilas(prev => prev.map((f, idx) => idx === i ? { nombre: alimento.nombre, ig: String(alimento.ig), carbsG: f.carbsG } : f));
  }

  function calcular() {
    const validos = filas.filter(f => f.nombre && f.ig && f.carbsG);
    if (validos.length === 0) { setError('Añade al menos un alimento con IG y carbohidratos'); return; }

    const alimentos: AlimentoIG[] = validos.map(f => ({
      nombre: f.nombre,
      ig:     parseFloat(f.ig),
      carbsG: parseFloat(f.carbsG),
    }));

    if (alimentos.some(a => isNaN(a.ig) || isNaN(a.carbsG))) {
      setError('Verifica que IG y carbohidratos sean números válidos');
      return;
    }

    setError('');
    setResultado(calcularIGComida(alimentos));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto' }}>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px', lineHeight: 1.6 }}>
        Introduce los alimentos de tu comida con su IG y cantidad de carbohidratos para calcular el índice y carga glucémica total.
      </p>

      {/* Tabla de alimentos */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '16px' }}>
        <div style={{ minWidth: '500px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 32px', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Alimento</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>IG (0–100)</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Carbos (g)</span>
            <span />
          </div>
          {filas.map((fila, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 32px', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
              <Input label="" value={fila.nombre} onChange={v => updateFila(i, 'nombre', v)} />
              <Input label="" value={fila.ig} onChange={v => updateFila(i, 'ig', v)} type="number" suffix="" />
              <Input label="" value={fila.carbsG} onChange={v => updateFila(i, 'carbsG', v)} type="number" suffix="g" />
              <button onClick={() => setFilas(prev => prev.filter((_, idx) => idx !== i))} style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '4px' }}>×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Alimentos comunes */}
      {filas.length < 5 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
            Búsqueda rápida (solo aplica nombre e IG)
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {ALIMENTOS_COMUNES.map(a => (
              <button key={a.nombre} onClick={() => {
                const iVacio = filas.findIndex(f => !f.nombre);
                if (iVacio >= 0) aplicarComun(iVacio, a);
                else setFilas(prev => [...prev, { nombre: a.nombre, ig: String(a.ig), carbsG: '' }]);
              }} style={{ padding: '4px 10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer' }}>
                {a.nombre} (IG {a.ig})
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {filas.length < 5 && (
          <button onClick={() => setFilas(prev => [...prev, emptyRow()])} style={{ padding: '8px 16px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer' }}>
            + Añadir alimento
          </button>
        )}
        <Button onClick={calcular}>Calcular IG comida</Button>
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

      {resultado && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>IG ponderado</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.igPonderado}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Carga glucémica</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.cargaGlucemica}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Categoría</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', lineHeight: 1.2, color: resultado.color }}>{resultado.categoria}</div>
            </div>
          </div>
          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px', marginTop: '1px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{resultado.recomendacion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
