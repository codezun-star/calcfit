import { useState } from 'react';
import { calcularMacronutrientes } from '../../lib/calculators';
import { toKg } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

type Objetivo  = 'perder' | 'mantener' | 'ganar';
type Actividad = 'sedentario' | 'ligero' | 'moderado' | 'activo';

export default function MacroCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [peso, setPeso] = useState('');
  const [lb, setLb] = useState('');
  const [objetivo, setObjetivo] = useState<Objetivo>('mantener');
  const [actividad, setActividad] = useState<Actividad>('moderado');
  const [result, setResult] = useState<ReturnType<typeof calcularMacronutrientes> | null>(null);

  const calcular = () => {
    const pesoKg = units === 'metric' ? parseFloat(peso) : toKg(parseFloat(lb));
    if (isNaN(pesoKg) || pesoKg < 20) return;
    setResult(calcularMacronutrientes({ pesoKg, objetivo, actividad }));
  };

  const btnBase: React.CSSProperties = { padding: '8px 14px', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)' };
  const btnActive: React.CSSProperties = { ...btnBase, background: 'var(--ink)', color: 'var(--acid)', border: '1px solid var(--ink)' };
  const selStyle: React.CSSProperties = { width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none', cursor: 'pointer' };

  return (
    <div style={{ padding: '32px', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />
      {units === 'metric'
        ? <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" />
        : <Input label="Peso" value={lb} onChange={setLb} suffix="lb" />
      }
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Objetivo</p>
        <div style={{ display: 'flex', gap: '1px' }}>
          {(['perder', 'mantener', 'ganar'] as Objetivo[]).map((o) => (
            <button key={o} style={objetivo === o ? btnActive : btnBase} onClick={() => setObjetivo(o)}>
              {o === 'perder' ? 'Perder peso' : o === 'mantener' ? 'Mantener' : 'Ganar músculo'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Nivel de actividad</p>
        <select value={actividad} onChange={(e) => setActividad(e.target.value as Actividad)} style={selStyle}>
          <option value="sedentario">Sedentario</option>
          <option value="ligero">Ligero</option>
          <option value="moderado">Moderado</option>
          <option value="activo">Activo</option>
        </select>
      </div>
      <Button onClick={calcular}>Calcular macros</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Calorías objetivo</div>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{result.calorias}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#666', marginLeft: '6px' }}>kcal/día</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {[
              { macro: 'Proteínas',    val: result.proteinas,     color: 'var(--acid)',   pct: Math.round(result.proteinas * 4 / result.calorias * 100) },
              { macro: 'Carbohidratos',val: result.carbohidratos, color: 'var(--cream)',  pct: Math.round(result.carbohidratos * 4 / result.calorias * 100) },
              { macro: 'Grasas',       val: result.grasas,        color: 'var(--muted)', pct: Math.round(result.grasas * 9 / result.calorias * 100) },
            ].map((m) => {
              const maxVal = Math.max(result.proteinas, result.carbohidratos, result.grasas);
              const barH = Math.round((m.val / maxVal) * 80);
              return (
                <div key={m.macro} style={{ background: 'var(--cream)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '90px' }}>
                    <div style={{ width: '32px', height: `${barH}px`, background: m.color, border: m.color === 'var(--cream)' ? '1px solid var(--border)' : 'none', transition: 'height 0.5s ease' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>{m.val}g</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', textAlign: 'center' }}>{m.macro}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink)' }}>{m.pct}%</div>
                </div>
              );
            })}
          </div>

          <ShareButtons
            text={`Mis macros diarios: ${result.proteinas}g proteínas, ${result.carbohidratos}g carbos, ${result.grasas}g grasas (${result.calorias} kcal).`}
            url="https://www.calcfit.com/macronutrientes"
          />
        </div>
      )}
    </div>
  );
}
