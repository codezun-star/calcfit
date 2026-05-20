import { useState } from 'react';
import { calcularCaloriasBebidas } from '../../lib/calculators';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

interface Counts {
  cervezas:  number;
  vinos:     number;
  licores:   number;
  cocktails: number;
}

const BEBIDAS: { key: keyof Counts; label: string; detalle: string; kcal: number }[] = [
  { key: 'cervezas',  label: 'Cerveza',         detalle: '330 ml · 5%',   kcal: 153 },
  { key: 'vinos',     label: 'Vino',             detalle: '150 ml · 12%',  kcal: 123 },
  { key: 'licores',   label: 'Licor / copa',     detalle: '40 ml · 40%',   kcal: 95  },
  { key: 'cocktails', label: 'Cocktail',         detalle: '200 ml · 10%',  kcal: 142 },
];

export default function CaloriasBedidasCalculator() {
  const [counts, setCounts]   = useState<Counts>({ cervezas: 0, vinos: 0, licores: 0, cocktails: 0 });
  const [result, setResult]   = useState<ReturnType<typeof calcularCaloriasBebidas> | null>(null);

  const update = (key: keyof Counts, delta: number) =>
    setCounts(c => ({ ...c, [key]: Math.max(0, c[key] + delta) }));

  const calcular = () => {
    setResult(calcularCaloriasBebidas(counts.cervezas, counts.vinos, counts.licores, counts.cocktails));
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Selecciona cuántas bebidas alcohólicas consumes y calcula el total de calorías y gramos de alcohol.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {BEBIDAS.map(b => (
          <div key={b.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{b.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{b.detalle} · {b.kcal} kcal</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => update(b.key, -1)}
                style={{ width: '32px', height: '32px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >−</button>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)', minWidth: '24px', textAlign: 'center' }}>{counts[b.key]}</span>
              <button
                onClick={() => update(b.key, 1)}
                style={{ width: '32px', height: '32px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >+</button>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={calcular} disabled={total === 0}>Calcular calorías</Button>

      {result && result.desglose.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Total calorías</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '60px', color: 'var(--acid)', lineHeight: 1 }}>{result.totalKcal}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>kcal</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Alcohol total</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '60px', color: '#ccc', lineHeight: 1 }}>{result.totalAlcoholG}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>gramos</div>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Desglose</div>
            {result.desglose.map(b => (
              <div key={b.nombre} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                <span style={{ color: 'var(--ink)' }}>{b.cantidad}× {b.nombre}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{b.kcalTotal} kcal · {Math.round(b.alcoholG * 10) / 10} g alcohol</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Equivale a quemar durante</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1px', background: 'var(--border)' }}>
              {result.equivalencias.map(e => (
                <div key={e.actividad} style={{ background: 'var(--cream)', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)', lineHeight: 1 }}>{e.minutos}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>min de {e.actividad.toLowerCase()}</div>
                </div>
              ))}
            </div>
          </div>

          <ShareButtons
            text={`Mis bebidas de esta noche suman ${result.totalKcal} kcal y ${result.totalAlcoholG} g de alcohol. Calculado con CalcFit:`}
            url="https://www.calcfit.com/calorias-bebidas"
          />
        </div>
      )}

      {result && result.desglose.length === 0 && (
        <div style={{ padding: '16px', background: 'var(--cream)', fontSize: '13px', color: 'var(--muted)', textAlign: 'center' }}>
          Añade al menos una bebida para ver el resultado.
        </div>
      )}
    </div>
  );
}
