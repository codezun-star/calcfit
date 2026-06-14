import { useState } from 'react';
import { calcularTDEE } from '../../lib/calculators';
import { toKg, toCm } from '../../lib/units';
import { useHistory } from '../../lib/useHistory';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import HistoryTable from '../ui/HistoryTable';
import ShareButtons from '../ui/ShareButtons';
import BarrasCaloria from './BarrasCaloria';

type Actividad = 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo';
type Sexo = 'hombre' | 'mujer';

const actividadLabels: Record<Actividad, string> = {
  sedentario:  'Sedentario (sin ejercicio)',
  ligero:      'Ligero (1-3 días/sem)',
  moderado:    'Moderado (3-5 días/sem)',
  activo:      'Activo (6-7 días/sem)',
  muy_activo:  'Muy activo (2x/día)',
};

export default function CaloriasCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [lb, setLb] = useState('');
  const [ft, setFt] = useState('');
  const [inches, setInches] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState<Sexo>('hombre');
  const [actividad, setActividad] = useState<Actividad>('moderado');
  const [result, setResult] = useState<ReturnType<typeof calcularTDEE> | null>(null);
  const [errors, setErrors] = useState<{ peso?: string; altura?: string; edad?: string }>({});
  const { addEntry } = useHistory('calorias-history');

  const calcular = () => {
    const errs: typeof errors = {};
    let pesoKg: number, alturaCm: number;
    if (units === 'metric') {
      pesoKg = parseFloat(peso); alturaCm = parseFloat(altura);
      if (isNaN(pesoKg)   || pesoKg < 20   || pesoKg > 300)   errs.peso   = 'Peso entre 20 y 300 kg';
      if (isNaN(alturaCm) || alturaCm < 100 || alturaCm > 250) errs.altura = 'Altura entre 100 y 250 cm';
    } else {
      pesoKg = toKg(parseFloat(lb)); alturaCm = toCm(parseFloat(ft), parseFloat(inches));
      if (isNaN(pesoKg)   || pesoKg < 20)   errs.peso   = 'Peso inválido';
      if (isNaN(alturaCm) || alturaCm < 100) errs.altura = 'Altura inválida';
    }
    const edadN = parseInt(edad, 10);
    if (isNaN(edadN) || edadN < 10 || edadN > 100) errs.edad = 'Edad entre 10 y 100 años';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const res = calcularTDEE({ pesoKg: pesoKg!, alturaCm: alturaCm!, edadAnios: edadN, sexo, actividad });
    setResult(res);
    addEntry(res.tdee);
  };

  const btnBase: React.CSSProperties = {
    padding: '8px 14px', fontSize: '11px', fontFamily: 'var(--font-mono)',
    cursor: 'pointer', border: '1px solid var(--border)', background: 'transparent',
    color: 'var(--muted)',
  };
  const btnActive: React.CSSProperties = { ...btnBase, background: 'var(--ink)', color: 'var(--acid)', border: '1px solid var(--ink)' };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      {units === 'metric' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
          <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" error={errors.peso} />
          <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" error={errors.altura} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px' }}>
          <Input label="Peso" value={lb} onChange={setLb} suffix="lb" error={errors.peso} />
          <Input label="Pies" value={ft} onChange={setFt} suffix="pies" error={errors.altura} />
          <Input label="Pulgadas" value={inches} onChange={setInches} suffix="pulg" />
        </div>
      )}

      <Input label="Edad" value={edad} onChange={setEdad} suffix="años" error={errors.edad} />

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Sexo</p>
        <div style={{ display: 'flex', gap: '1px' }}>
          <button style={sexo === 'hombre' ? btnActive : btnBase} onClick={() => setSexo('hombre')}>Hombre</button>
          <button style={sexo === 'mujer'  ? btnActive : btnBase} onClick={() => setSexo('mujer')}>Mujer</button>
        </div>
      </div>

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Nivel de actividad</p>
        <select
          value={actividad}
          onChange={(e) => setActividad(e.target.value as Actividad)}
          style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none', cursor: 'pointer' }}
        >
          {(Object.keys(actividadLabels) as Actividad[]).map((a) => (
            <option key={a} value={a}>{actividadLabels[a]}</option>
          ))}
        </select>
      </div>

      <Button onClick={calcular}>Calcular calorías</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Calorías de mantenimiento" value={result.tdee} unit="kcal/día" interpretation={`TMB: ${result.tmb} kcal · Con tu nivel de actividad`} />
          <BarrasCaloria tdee={result.tdee} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Perder peso</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>{result.deficit} <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>kcal</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Ganar músculo</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>{result.superavit} <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>kcal</span></div>
            </div>
          </div>
          <ShareButtons text={`Mis calorías de mantenimiento son ${result.tdee} kcal/día.`} url="https://www.calcfit.com/calorias-diarias" />
          <HistoryTable storageKey="calorias-history" unit="kcal" />
        </div>
      )}
    </div>
  );
}
